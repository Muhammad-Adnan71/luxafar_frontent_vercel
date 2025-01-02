import translate from "aws-sdk/clients/translate";
const t = new translate({
  signatureVersion: "v4",
  region: process.env.NEXT_PUBLIC_S3_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
});

export async function translateObj(
  obj: any,
  source: any,
  target: any,
  callback: any
) {
  async function innerIterate(obj: any, parentKeys: any = []) {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        await innerIterate(obj[key], [...parentKeys, key]);
      } else if (typeof obj[key] === "string" && obj[key].length > 0) {
        const response = await callback(obj[key], source, target);
        obj[key] = response;
      }
    }
  }

  await innerIterate(obj);
}

export function getDifferentValues(obj1: any, obj2: any): any {
  const diffObj: any = {};

  for (const key in obj1) {
    if (
      obj1.hasOwnProperty(key) &&
      obj2.hasOwnProperty(key) &&
      obj1[key]?.replaceAll(/<\/?p>|<\/br>|<br>/g, "").trim() !==
        obj2[key]?.replaceAll(/<\/?p>|<\/br>|<br>/g, "").trim()
    ) {
      diffObj[key] = obj2[key];
    }
  }

  return diffObj;
}
export async function translateService(key: any, source: any, target: any) {
  try {
    const params = {
      SourceLanguageCode: source,
      TargetLanguageCode: target,
      Text: key,
    };
    const response = await t.translateText(params).promise();

    return response.TranslatedText;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
