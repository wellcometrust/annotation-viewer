// Use 'browser.driver' for non Angular pages
describe('starterpage', function() {
  browser.driver.get('http://localhost:3000/index.html');
  
  it("should load", function() {
    expect(browser.driver.getTitle()).toBe('Front end starter');
  });
});
