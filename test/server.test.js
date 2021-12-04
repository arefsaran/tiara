const landing = require("../routes/landing");

test("adds 1 + 2 to equal 3", () => {
    expect(landing(1, 2)).toBe(3);
});
