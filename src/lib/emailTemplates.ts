export const generateNewsletterEmail = (content: string, subscriberEmail: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.joyshypnose-therapies.com';
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter Joy's Hypnose</title>
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
          <h1>Joy's Hypnose</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Joy's Hypnose<br>
          17 Rue Bab El Mandab, Residence El Prado 2,<br>
          1er étage appart #2 Bourgogne,<br>
          Casablanca</p>
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