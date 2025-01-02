import React from "react";
import { ContentResponse } from "@utils/types";
import ContactForm from "./contactForm";
import { Locale, i18n } from "i18n.config";
import { getDictionary } from "@utils/dictionary";

export const Contact = async ({
  data,
  locale,
  dictionary,
}: {
  locale: any;
  dictionary: any;
  data: ContentResponse | undefined;
}) => {
  return (
    <ContactForm
      data={data}
      locale={locale}
      dictionary={{
        placeholder: dictionary.placeholder,
        buttonText: dictionary.button.send,
        errors: dictionary.errors,
        successModal: dictionary.successModal,
        dropdown: dictionary.dropdown,
      }}
    />
  );
};

export default Contact;
