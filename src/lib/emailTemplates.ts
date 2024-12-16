export const generateNewsletterEmail = (content: string, subscriberEmail: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://joys-coiffure.fr';
  const unsubscribeToken = Buffer.from(subscriberEmail).toString('base64');
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriberEmail)}&token=${unsubscribeToken}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter Joy's Coiffure</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
          }
          .unsubscribe {
            color: #666;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Joy's Coiffure</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Joy's Coiffure<br>
          4 rue de la Gare<br>
          67120 Molsheim</p>
          <p>
            <a href="${unsubscribeUrl}" class="unsubscribe">
              Cliquez ici pour vous désabonner de la newsletter
            </a>
          </p>
        </div>
      </body>
    </html>
  `;
}; 