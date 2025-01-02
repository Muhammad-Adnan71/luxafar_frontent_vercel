import { inspirationUrl, truncateText } from "@utils/functions";

export const contactTemplate = (name: string) =>
  `<div
      style="
        background-color: #092730;
        max-width: 400px;
        padding: 20px;
        margin: 0 auto;
      "
    >
    <div style="text-align:center; width:100%;">
    <a href="https://luxafar.com/">
          <img loading="lazy" style="
          width: 120px;
          height: auto;
          margin: 0 auto;" 
          src="https://luxafar.com/template/logo.png" alt="" />
          </a>
    </div>
      <p
        style="
          margin-bottom: 15px;
          font-size: 13px;
          font-weight: 600;
          color: #A69769;
        "
      >
        Dear ${[name]}
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        Thank you for choosing Luxafar, where we celebrate the uniqueness of
        every journey. Your message has been received and is of great importance
        to us. Our team is currently reviewing your inquiry and will respond
        within 24 hours.
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        Should you have any additional details to share, please feel free to
        reply to this email.
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        At Luxafar, we firmly believe that there are no standard journeys, only
        extraordinary stories waiting to be written.
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        We appreciate your interest in Luxafar and eagerly anticipate crafting
        your exceptional journey.
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        Best Regards,
      </p>
      <p style="margin-bottom: 20px; font-size: 13px; color: #A69769;">
        Ghazal Sajid <br />CEO <br />Mobile No: +971552944761 <br />WhatsApp No:
        +442034682356 <br />www.luxafar.com
      </p>
      <div
        style="
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
          align-items: center;
        "
      >
        <a href="https://google.com">
          <img loading="lazy" style="width:10px;" src="https://luxafar.com//template/facebook.png" alt="" />
        </a>
        <a href="https://google.com">
          <img loading="lazy" style="width:19px; padding-left:10px;" src="https://luxafar.com//template/twitter.png" alt="" />
        </a>
        <a href="https://google.com">
          <img loading="lazy" style="width:16px; padding-left:10px; " src="https://luxafar.com//template/instagram.png" alt="" />
        </a>
      </div>
    </div>`;

export const emailTemplate = (inspiration: any, name: any, bannerImage?: any) =>
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Luxafar Email Template</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital@0;1&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      p {
        font-family: "Montserrat", sans-serif !important;
      }
      h1,
      h4 {
        font-family: "Playfair Display", serif !important;
      }
      img {
        max-width: 100%;
        object-fit: cover;
      }
      a {
        text-decoration: none;
      }
      a,
      p
       {
        color: #000000 !important;
        line-height:1.6
      }
      .bannerImage {
        width: 99%;
        max-width:99%;
        margin:0 auto;  
        vertical-align:middle;
        height: 350px;
        margin-bottom: 30px;
        object-fit:cover
      }
      header {
        width: 100%;
        padding: 20px 0;
        max-width: 800px;
        margin: 0 auto;
        height: 86px;
        margin-bottom: 10px;
      }
      .logo {
        max-width: 150px;
        float: left;
        margin: auto 0;
        margin-bottom: 10px;
      }
      @media only screen and (max-width: 640px) {
    .logo {
        max-width: 140px;
        margin-top:10px;
       
      }
       .whatsappNo {
        font-size: 12px;
       
      }
      .contactContainer{
      width: 95% !important;
      }
      .bannerImage
      {
        height:250px
      }
      .name{
  margin-bottom: 15px !important; 
}

.contactPara{
margin-bottom: 15px !important;

}

.inspirationMedia{
 width: 100% !important;
  height:100%;
   display:block;
              
}
.inspirationText
{
  display:block;
   padding-left: 0px !important; 
   width: 100% !important;
   height:100%;
   margin-top:20px
}

.ceo
{
  margin-top:40px;
}

}

      .whatsapp {
        text-align: right;
        font-size: 12px;
        margin-bottom: 2px;
        margin-top: 6px;
        font-family: "Montserrat", sans-serif !important;

      }
      .whatsappNo {
        text-align: right;
        font-size: 14px;
        font-weight:600;
        font-family: "Montserrat", sans-serif !important;

      }
      .contactContainer {
        width: 80%;
        margin: 0 auto;
        max-width: 800px;
      }
      footer {
        background-color: #092730;
        background-image: url(https://luxafar.com/template/background-pattern-mobile.png);
        background-repeat: repeat;
        background-attachment: fixed;
        margin-top: 30px;
      }
      .ceo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #a69769;
      }
      .ceo img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: contain;
      }
      .footer_inner {
        width: 90%;
        padding: 30px 0;
        max-width: 800px;
        margin: 0 auto;
        overflow: hidden;
      }
      footer .heading {
        text-align: center;
        color: #a69769;
        font-size: 22px;
        margin-bottom: 40px;
      }
      main {
        margin-bottom: 50px;
        overflow: hidden;
      }
      body {
        background-color: #ffffff;
        overflow: hidden;
      }
      .inspirationImage{
             width: 100%;
             height:150px;
                  object-fit: cover;
                  display: block;
                  margin: 0 auto;
      }
      .inspirationTitle{
        color: #a69769; font-size: 16px; margin-bottom: 10px
      }
      .inspirationDescription{
             color: #ffffff !important;
            margin-bottom: 10px;
              font-size: 12px;
              line-height: 1.5;
              font-family: "Montserrat", sans-serif !important;
      }
      .readmore
      {
                text-transform: uppercase;
                  color: #a69769 !important;
                  font-size: 11px;
                  text-decoration: none;
               
      }
.name{
  margin-bottom: 40px; text-transform: capitalize
}
.contactPara{
margin-bottom: 40px

}
.inspirationMedia{
  vertical-align: middle; width: 35%; height:100%;
}
.inspirationMedia img {
  width:100%
}
.inspirationText
{
  vertical-align: middle; padding-left: 20px; width: 65%;height:100%;
}


    </style>
  </head>
  <body>
    <header>
      <div style="margin: 0 auto">
        <img src="https://luxafar.com/template/logo.png" class="logo" alt="" />
        <div style="float: right">
          <p class="whatsapp">WhatsApp No:</p>
          <p class="whatsappNo">+442034682356</p>
        </div>
      </div>
    </header>
    <main>
  
       <img
        src="${bannerImage ?? "https://luxafar.com/template/banner.png"}"
     class="bannerImage"
        alt=""
      />
      <div class="contactContainer">
        <p  class="name">
          Dear ${[name]}
        </p>
        <p class="contactPara">
          Thank you for considering Luxafar for your upcoming journey. We're
          thrilled to help you discover the epitome of luxury travel.
        </p>
        <p class="contactPara">
          Our team is dedicated to crafting personalized experiences tailored to
          your unique preferences. Expect a call from one of our expert travel
          specialists soon. They'll tailor a bespoke itinerary perfectly aligned
          with your preferences and desires.
        </p>
        <p class="contactPara">
          We can't wait to turn your travel dreams into reality.
        </p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="vertical-align: middle; width: 120px ;">
              <div class="ceo">
                <img
                  src="https://luxafar.com/template/gazal-sajid.png"
                  alt="Luxafar CEO Image"
                />
              </div>
            </td>
            <td style="vertical-align: middle">
              <div style="margin-left: 20px">
                <p
                  style="margin-bottom: 5px; font-size: 14px; font-weight: 500"
                >
                  GHAZAL SAJID
                </p>
                <p
                  style="margin-bottom: 8px; font-size: 12px; font-weight: 500"
                >
                  CEO
                </p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </main>
      <footer>
      <div class="footer_inner">
        <h1 class="heading">Explore our blog posts for valuable insights</h1>
       <table cellpadding="0" cellspacing="0" border="0" width="100%">
         ${inspiration
    .map(
      (item: any) => `
           <tr style="margin-bottom: 30px">
            <td class="inspirationMedia">
              <img
                src="${item?.media?.desktopMediaUrl}"
                alt=""
               class="inspirationImage"
              />
            </td>
            <td class="inspirationText">
              <h4 class="inspirationTitle">
                ${truncateText(item.title, 50)}
              </h4>
              <p

               class="inspirationDescription"
              >
                ${truncateText(
        item?.description?.replaceAll("<p>", "")?.replaceAll("</p>", ""),
        150
      )}
              </p>
              <a
                href="${process.env["METADATA_BASE_URL"] +
        inspirationUrl(item, item?.destination?.[0]?.name)
        }"
              class="readmore"
              >
                Read More
              </a>
            </td>
          </tr>
          <tr style="height:30px"></tr>
        `
    )
    .join("")}
        </table> 
      </div>
    </footer>
  </body>
</html>
`;

export const emailTemplatePopup = (inspiration: any, name: any, bannerImage?: any) =>
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Luxafar Email Template</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital@0;1&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      p {
        font-family: "Montserrat", sans-serif !important;
      }
      h1,
      h4 {
        font-family: "Playfair Display", serif !important;
      }
      img {
        max-width: 100%;
        object-fit: cover;
      }
      a {
        text-decoration: none;
      }
      a,
      p
       {
        color: #000000 !important;
        line-height:1.6
      }
      .bannerImage {
        width: 99%;
        max-width:99%;
        margin:0 auto;  
        vertical-align:middle;
        height: 350px;
        margin-bottom: 30px;
        object-fit:cover
      }
      header {
        width: 100%;
        padding: 20px 0;
        max-width: 800px;
        margin: 0 auto;
        height: 86px;
        margin-bottom: 10px;
      }
      .logo {
        max-width: 150px;
        float: left;
        margin: auto 0;
        margin-bottom: 10px;
      }
      @media only screen and (max-width: 640px) {
    .logo {
        max-width: 140px;
        margin-top:10px;
       
      }
       .whatsappNo {
        font-size: 12px;
       
      }
      .contactContainer{
      width: 95% !important;
      }
      .bannerImage
      {
        height:250px
      }
      .name{
  margin-bottom: 15px !important; 
}

.contactPara{
margin-bottom: 15px !important;

}

.inspirationMedia{
 width: 100% !important;
  height:100%;
   display:block;
              
}
.inspirationText
{
  display:block;
   padding-left: 0px !important; 
   width: 100% !important;
   height:100%;
   margin-top:20px
}

.ceo
{
  margin-top:40px;
}

}

      .whatsapp {
        text-align: right;
        font-size: 12px;
        margin-bottom: 2px;
        margin-top: 6px;
        font-family: "Montserrat", sans-serif !important;

      }
      .whatsappNo {
        text-align: right;
        font-size: 14px;
        font-weight:600;
        font-family: "Montserrat", sans-serif !important;

      }
      .contactContainer {
        width: 80%;
        margin: 0 auto;
        max-width: 800px;
      }
      footer {
        background-color: #092730;
        background-image: url(https://luxafar.com/template/background-pattern-mobile.png);
        background-repeat: repeat;
        background-attachment: fixed;
        margin-top: 30px;
      }
      .ceo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #a69769;
      }
      .ceo img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: contain;
      }
      .footer_inner {
        width: 90%;
        padding: 30px 0;
        max-width: 800px;
        margin: 0 auto;
        overflow: hidden;
      }
      footer .heading {
        text-align: center;
        color: #a69769;
        font-size: 22px;
        margin-bottom: 40px;
      }
      main {
        margin-bottom: 50px;
        overflow: hidden;
      }
      body {
        background-color: #ffffff;
        overflow: hidden;
      }
      .inspirationImage{
             width: 100%;
             height:150px;
                  object-fit: cover;
                  display: block;
                  margin: 0 auto;
      }
      .inspirationTitle{
        color: #a69769; font-size: 16px; margin-bottom: 10px
      }
      .inspirationDescription{
             color: #ffffff !important;
            margin-bottom: 10px;
              font-size: 12px;
              line-height: 1.5;
              font-family: "Montserrat", sans-serif !important;
      }
      .readmore
      {
                text-transform: uppercase;
                  color: #a69769 !important;
                  font-size: 11px;
                  text-decoration: none;
               
      }
.name{
  margin-bottom: 40px; text-transform: capitalize
}
.contactPara{
margin-bottom: 40px

}
.inspirationMedia{
  vertical-align: middle; width: 35%; height:100%;
}
.inspirationMedia img {
  width:100%
}
.inspirationText
{
  vertical-align: middle; padding-left: 20px; width: 65%;height:100%;
}


    </style>
  </head>
  <body>
    <header>
      <div style="margin: 0 auto">
        <img src="https://luxafar.com/template/logo.png" class="logo" alt="" />
        <div style="float: right">
          <p class="whatsapp">WhatsApp No:</p>
          <p class="whatsappNo">+442034682356</p>
        </div>
      </div>
    </header>
    <main>
  
       <img
        src="${bannerImage ?? "https://luxafar.com/template/banner.png"}"
     class="bannerImage"
        alt=""
      />
      <div class="contactContainer">
        <p  class="name">
          Dear ${[name]}
        </p>
        <p class="contactPara">
          Thank you for signing up. We will keep you posted with the latest trends
          and information on travel that you do not want to miss out on!
        </p>
        <p class="contactPara">
          Our team is dedicated to crafting personalized experiences tailored to
          your unique preferences. Expect a call from one of our expert travel
          specialists soon. They'll tailor a bespoke itinerary perfectly aligned
          with your preferences and desires.
        </p>
        <p class="contactPara">
          We can't wait to turn your travel dreams into reality.
        </p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="vertical-align: middle; width: 120px ;">
              <div class="ceo">
                <img
                  src="https://luxafar.com/template/gazal-sajid.png"
                  alt="Luxafar CEO Image"
                />
              </div>
            </td>
            <td style="vertical-align: middle">
              <div style="margin-left: 20px">
                <p
                  style="margin-bottom: 5px; font-size: 14px; font-weight: 500"
                >
                  GHAZAL SAJID
                </p>
                <p
                  style="margin-bottom: 8px; font-size: 12px; font-weight: 500"
                >
                  CEO
                </p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </main>
      <footer>
      <div class="footer_inner">
        <h1 class="heading">Explore our blog posts for valuable insights</h1>
       <table cellpadding="0" cellspacing="0" border="0" width="100%">
         ${inspiration
    .map(
      (item: any) => `
           <tr style="margin-bottom: 30px">
            <td class="inspirationMedia">
              <img
                src="${item?.media?.desktopMediaUrl}"
                alt=""
               class="inspirationImage"
              />
            </td>
            <td class="inspirationText">
              <h4 class="inspirationTitle">
                ${truncateText(item.title, 50)}
              </h4>
              <p

               class="inspirationDescription"
              >
                ${truncateText(
        item?.description?.replaceAll("<p>", "")?.replaceAll("</p>", ""),
        150
      )}
              </p>
              <a
                href="${process.env["METADATA_BASE_URL"] +
        inspirationUrl(item, item?.destination?.[0]?.name)
        }"
              class="readmore"
              >
                Read More
              </a>
            </td>
          </tr>
          <tr style="height:30px"></tr>
        `
    )
    .join("")}
        </table> 
      </div>
    </footer>
  </body>
</html>
`
