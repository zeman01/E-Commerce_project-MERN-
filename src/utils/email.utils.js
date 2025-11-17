


export const registerSuccessEmail = (username = "User") => {
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome Email</title>


<style>
/* Base styles */
body {
font-family: Arial, sans-serif;
background-color: #f6f6f6;
margin: 0;
padding: 0;
line-height: 1.6;
}
.container {
max-width: 600px;
margin: auto;
background: #ffffff;
padding: 20px;
border-radius: 10px;
box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
h2 {
color: #4CAF50;
}
p {
color: #333333;
font-size: 16px;
}


/* Responsive */
@media(max-width: 600px) {
.container {
padding: 15px;
}
p {
font-size: 15px;
}
h2 {
font-size: 20px;
}
}


/* Dark mode */
@media (prefers-color-scheme: dark) {
body {
background-color: #1a1a1a;
}
.container {
background-color: #2b2b2b;
color: #eaeaea;
}
p {
color: #d6d6d6;
}
h2 {
color: #6DDA7D;
}
}
</style>
</head>


<body>
<div class="container">
<h2>Welcome to Our Platform!</h2>
<p>Dear ${username},</p>
<p>Thank you for registering with us. We're excited to have you on board!</p>
<p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
<br />
<p>Best regards,<br/>The Team</p>
</div>
</body>
</html>`;


const text = `Welcome to Our Platform!\n\nDear ${username},\n\nThank you for registering with us. We're excited to have you on board!\nIf you have any questions or need assistance, feel free to contact our support team.\n\nBest regards,\nThe Team`;


return { html, text };
};


