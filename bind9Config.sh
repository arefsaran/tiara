cat <<EOF >>/etc/nginx/sites-available/$1
server {
    server_name $1 *.$1;
    root /root/sites/tiaraplatform;
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    index index.html;
    location / {
        proxy_pass http://127.0.0.1:4002;
        proxy_set_header X-Host $1;
    }
}
EOF

ln -s /etc/nginx/sites-available/$1 /etc/nginx/sites-enabled/$1

cat <<EOF >>/etc/bind/zones/$1.conf
zone "$1" {
        type master;
        file "/etc/bind/zones/db.$1";
        allow-transfer { 185.173.104.103; };
};
zone "185.173.in-addr.arpa" {
        type master;
        file "/etc/bind/zones/db.$1_reverse";
        allow-transfer { 185.173.104.103; };
};
EOF

cat <<EOF >>/etc/bind/named.conf.local
include "/etc/bind/zones/$1.conf";
EOF

cat <<EOF >/etc/bind/zones/db.$1
\$TTL   604800
@       IN      SOA     $1. *.$1. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns1.$1.
@       IN      A       $1.
ns1     IN      A       $1.
* CNAME IN      A       $1.
EOF

cat <<EOF >>/etc/bind/zones/db.$1_reverse
$TTL    604800
@       IN      SOA     $1. *.$1. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN          NS      *.$1.
        IN          NS      $1.
103.104     IN      PTR     $1.
EOF

rndc reload
service nginx restart