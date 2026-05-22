const React = require('react');
const { render } = require('@react-email/components');
const { CustomAdminEmail } = require('../emails/CustomAdminEmail');

try {
  const html = render(React.createElement(CustomAdminEmail, {
    title: "Test Headline",
    message: "Test Message",
    buttonText: "Click Me",
    buttonUrl: "https://google.com"
  }));
  console.log("HTML Rendered successfully!");
  console.log(html.substring(0, 300));
} catch (err) {
  console.error("Error during rendering:", err.stack);
}
