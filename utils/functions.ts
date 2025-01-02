import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { getUploadsUrl } from "@utils/services/uploads";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { WEB_ROUTES } from "./constant";
import { Locale, i18n } from "i18n.config";

export const getLastWordInString = (words: string) => {
  const arr = words.split(" ");
  return arr[arr.length - 1];
};
export const getStringWithoutLastWord = (words: string) => {
  const arr = words.split(" ");
  arr.pop();
  return arr.join(" ");
};
export function removeTags(input: string) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  if (doc.body.textContent == "null") {
    doc.body.textContent = "";
  }
  return doc.body.textContent || "";
}
export const isFile = (input: File | string | undefined) => {
  if ("File" in window && input instanceof File) return true;
  else return false;
};
export const inspirationUrl = (
  inspiration: any,
  destinationName?: string
): string => {
  return "/" + inspiration?.seoMeta?.slug;
};

export const replaceSpacesWithDash = (value?: string) => {
  return value?.trim()?.toLowerCase()?.replaceAll(" ", "-");
};

// export const convertMediaIdsResponseIntoMediaUrl = async (
//   response: any[] | null | any,
//   key: string | string[] = "media"
// ) => {
//   if (Array.isArray(response)) {
//     response = await Promise.all(
//       response.map(async (item: any) => {
//         if (!Array.isArray(key)) {
//           const mediaUrls = await getUploadsUrl({
//             desktopMediaUrl: item?.[key]?.desktopMediaUrl,
//             mobileMediaUrl: item?.[key]?.mobileMediaUrl,
//           });
//           return {
//             ...item,
//             [key]: {
//               ...item?.[key],
//               desktopMediaUrl: mediaUrls?.data[0]?.desktopMediaUrl,
//               mobileMediaUrl: mediaUrls?.data[1]?.mobileMediaUrl,
//             },
//           };
//         } else {
//           const mediaResponses = await Promise.all(
//             key.map(async (k) => {
//               const mediaUrls = await getUploadsUrl({
//                 desktopMediaUrl: item?.[k]?.desktopMediaUrl,
//                 mobileMediaUrl: item?.[k]?.mobileMediaUrl,
//               });
//               return {
//                 [k]: {
//                   ...item?.[k],
//                   desktopMediaUrl: mediaUrls?.data[0]?.desktopMediaUrl,
//                   mobileMediaUrl: mediaUrls?.data[1]?.mobileMediaUrl,
//                 },
//               };
//             })
//           );
//           const formattedData = mediaResponses.reduce((result, media) => {
//             const mediaType = Object.keys(media)[0];
//             const mediaInfo = media[mediaType];

//             result[mediaType] = {
//               id: mediaInfo.id,
//               desktopMediaUrl: mediaInfo.desktopMediaUrl,
//               mobileMediaUrl: mediaInfo.mobileMediaUrl,
//               createdAt: mediaInfo.createdAt,
//               updatedAt: mediaInfo.updatedAt,
//             };

//             return result;
//           }, {});

//           return {
//             ...item,
//             ...formattedData,
//           };
//         }
//       })
//     );
//     return response;
//   } else if (typeof response === "object") {
//     if (!Array.isArray(key)) {
//       const res = await getUploadsUrl({
//         desktopMediaUrl: response?.[key]?.desktopMediaUrl as string,
//         mobileMediaUrl: response?.[key]?.mobileMediaUrl as string,
//       });
//       return {
//         ...response,
//         [key]: {
//           desktopMediaUrl: res?.data[0]?.desktopMediaUrl,
//           mobileMediaUrl: res?.data[1]?.mobileMediaUrl,
//         },
//       };
//     } else {
//       const mediaResponses = await Promise.all(
//         key.map(async (k) => {
//           const res = await getUploadsUrl({
//             desktopMediaUrl: response?.[k]?.desktopMediaUrl as string,
//             mobileMediaUrl: response?.[k]?.mobileMediaUrl as string,
//           });
//           return {
//             [k]: {
//               ...response?.[k],
//               desktopMediaUrl: res?.data[0]?.desktopMediaUrl,
//               mobileMediaUrl: res?.data[1]?.mobileMediaUrl,
//             },
//           };
//         })
//       );
//       const formattedData = mediaResponses.reduce((result: any, media: any) => {
//         const mediaType = Object.keys(media)[0];
//         const mediaInfo = media[mediaType];

//         result[mediaType] = {
//           id: mediaInfo?.id,
//           desktopMediaUrl: mediaInfo?.desktopMediaUrl,
//           mobileMediaUrl: mediaInfo?.mobileMediaUrl,
//           type: mediaInfo?.type,
//           createdAt: mediaInfo?.createdAt,
//           updatedAt: mediaInfo?.updatedAt,
//         };

//         return result;
//       }, {});
//       return { ...response, ...formattedData };
//     }
//   }
// };

export const convertMediaIdsResponseIntoMediaUrl = async (
  response: any[] | null | any,
  key: string | string[] = "media"
) => {
  if (Array.isArray(response)) {
    // Use Promise.all to handle async operations and return the mapped array
    return await Promise.all(
      response.map(async (item: any) => {
        if (!Array.isArray(key)) {
          return {
            ...item,
            [key]: {
              ...item?.[key],
              desktopMediaUrl: item?.[key]?.desktopMediaUrl
                ? "https://dgxq8gulu1450.cloudfront.net/" +
                  item?.[key]?.desktopMediaUrl
                : "",
              mobileMediaUrl: item?.[key]?.mobileMediaUrl
                ? "https://dgxq8gulu1450.cloudfront.net/" +
                  item?.[key]?.mobileMediaUrl
                : "",
            },
          };
        } else {
          const mediaResponses = await Promise.all(
            key.map(async (k) => ({
              [k]: {
                ...item?.[k],
                desktopMediaUrl: item?.[k]?.desktopMediaUrl
                  ? "https://dgxq8gulu1450.cloudfront.net/" +
                    item?.[k]?.desktopMediaUrl
                  : "",
                mobileMediaUrl: item?.[k]?.mobileMediaUrl
                  ? "https://dgxq8gulu1450.cloudfront.net/" +
                    item?.[k]?.mobileMediaUrl
                  : "",
              },
            }))
          );

          const formattedData = mediaResponses.reduce(
            (result: any, media: any) => {
              const mediaType = Object.keys(media)[0];
              const mediaInfo = media[mediaType];
              result[mediaType] = {
                id: mediaInfo?.id,
                desktopMediaUrl: mediaInfo?.desktopMediaUrl,
                mobileMediaUrl: mediaInfo?.mobileMediaUrl,
                createdAt: mediaInfo?.createdAt,
                updatedAt: mediaInfo?.updatedAt,
              };
              return result;
            },
            {}
          );

          return {
            ...item,
            ...formattedData,
          };
        }
      })
    );
  } else if (typeof response === "object" && response !== null) {
    if (!Array.isArray(key)) {
      return {
        ...response,
        [key]: {
          desktopMediaUrl: response?.[key]?.desktopMediaUrl
            ? "https://dgxq8gulu1450.cloudfront.net/" +
              response?.[key]?.desktopMediaUrl
            : "",
          mobileMediaUrl: response?.[key]?.mobileMediaUrl
            ? "https://dgxq8gulu1450.cloudfront.net/" +
              response?.[key]?.mobileMediaUrl
            : "",
        },
      };
    } else {
      const mediaResponses = key.map((k) => ({
        [k]: {
          ...response?.[k],
          desktopMediaUrl: response?.[k]?.desktopMediaUrl
            ? "https://dgxq8gulu1450.cloudfront.net/" +
              response?.[k]?.desktopMediaUrl
            : "",
          mobileMediaUrl: response?.[k]?.mobileMediaUrl
            ? "https://dgxq8gulu1450.cloudfront.net/" +
              response?.[k]?.mobileMediaUrl
            : "",
        },
      }));

      const formattedData = mediaResponses.reduce((result: any, media: any) => {
        const mediaType = Object.keys(media)[0];
        const mediaInfo = media[mediaType];
        result[mediaType] = {
          id: mediaInfo?.id,
          desktopMediaUrl: mediaInfo?.desktopMediaUrl,
          mobileMediaUrl: mediaInfo?.mobileMediaUrl,
          type: mediaInfo?.type,
          createdAt: mediaInfo?.createdAt,
          updatedAt: mediaInfo?.updatedAt,
        };
        return result;
      }, {});

      return { ...response, ...formattedData };
    }
  }
  return response; // Handle null case
};

export const removeParaTagsFromString = (string: string) =>
  string?.replaceAll(/<\/?p>/g, "");

export const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

export function isNumeric(str: string) {
  if (typeof str != "string") return false;
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function friendlyUrl(input: string) {
  const output = input
    ?.toLowerCase()
    .replaceAll(/[,:.'";!@$.]+/g, "")
    .trim()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/&+/g, "and");
  return output;
}

export function friendlySlug(input: string) {
  const output = input
    ?.toLowerCase()
    .replaceAll(/[,:'";!@$.]+/g, "")
    .replaceAll(/\s+/g, " ")
    .trim()
    .replaceAll(/&+/g, "and");
  return output;
}
export function capitalizeFirstLetter(str?: string) {
  return str && str?.charAt(0)?.toUpperCase() + str?.slice(1);
}
export const dateFormat = (date: any) => {
  const convertDate = new Date(date);
  const formatDate = format(convertDate, "yyyy-MM-dd");
  return formatDate;
};

export const truncateText = (value?: string, length: number = 30) => {
  if (value)
    return value?.length >= length ? value?.slice(0, length) + "..." : value;
};
export const pageLinkRemoveExtraSpaces = (
  value: string,
  id: number,
  route: string
) => `/admin/${route}/${id}`;
export const getLocaleCookie = (cookieStore: ReadonlyRequestCookies) => {
  const locale = cookieStore.get("lang") as any;

  return locale?.value ?? i18n.defaultLocale;
};
export const redirectedPathName = (locale: string, pathName?: string) => {
  if (!pathName) return "/";
  const segments = pathName.split("/");
  // segments[1] = locale === i18n.defaultLocale ? "" : locale;
  segments.splice(1, 1);
  const x = segments.join("/");
  return x;
};
export const pathNameByLocale = (locale: string, pathName: string) => {
  return locale === i18n.defaultLocale ? pathName : `/${locale}${pathName}`;
};
export const getLocaleFromServer = (lang: Locale) =>
  i18n.locales.includes(lang) ? lang : i18n.defaultLocale;

export const convertDateIntoFormattedDateAndTime = (
  value?: Date | string,
  option: { showTime?: boolean } = { showTime: true }
) => {
  if (value) {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const options: any = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedTime = date.toLocaleTimeString("en-US", options);
    const result = `${formattedDate} ${
      option.showTime ? `, ${formattedTime}` : ""
    }`;
    return result;
  }
};
