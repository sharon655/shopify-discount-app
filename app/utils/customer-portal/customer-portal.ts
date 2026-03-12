export const emailActionsConfig = {
  title: "Email Actions",
  fields: [
    {
      key: "sendEmailText",
      label: "Send Email Text",
      hasInfo: false,
      defaultValue: "Send Email",
    },
    {
      key: "sendEmailAddressText",
      label: "Send Email Address Text",
      hasInfo: false,
      defaultValue: "Email address",
    },
    {
      key: "emailMagicLinkText",
      label: "Email Magic Link Text",
      hasInfo: false,
      defaultValue: "Email Magic Link",
    },
    {
      key: "retrieveMagicLinkText",
      label: "Retrieve Magic Link Text",
      hasInfo: false,
      defaultValue: "Retrieve Magic Link",
    },
    {
      key: "retrieveMagicLinkDescription",
      label: "Retrieve Magic Link description",
      hasInfo: false,
      defaultValue:
        "Enter your email address below and click on the Email Magic Link button. We will send you an email containing a special link (Magic Link) that will allow you to safely check in and enable you to view subscriptions associated with your email address.",
    },
  ],
};

export const emailMessagesConfig = {
  title: "Email Messages",
  fields: [
    {
      key: "invalidEmail",
      label: "Please enter valid email Text",
      hasInfo: false,
      defaultValue: "Please enter valid email",
    },
    {
      key: "emailTriggeredSuccessfullyText",
      label: "Email Triggered Successfully Text",
      hasInfo: false,
      defaultValue: "Email Triggered Successfully.",
    },
    {
      key: "customerEmailNotExistText",
      label: "Customer Email Not Exist Message Text",
      hasInfo: false,
      defaultValue: "Customer Email Not Exist.",
    },
    {
      key: "customerEmailIsDisabledText",
      label: "Customer Email Is Disabled Message Text",
      hasInfo: false,
      defaultValue: "Customer Email Is Disabled.",
    },
  ],
};

export const buildBoxContractConfig = {
  title: "Build A Box Contract",
  fields: [
    {
      key: "minimumQuantityErrorMessage",
      label: "Minimum quantity error message for Build A Box Subscription",
      hasInfo: false,
      defaultValue:
        "The Build A Box Subscription requires a minimum of {{minProduct}} products.",
    },
    {
      key: "maximumQuantityErrorMessage",
      label: "Maximum quantity error message for Build A Box Subscription",
      hasInfo: false,
      defaultValue:
        "The Build A Box Subscription requires a maximum of {{maxProduct}} products.",
    },
  ],
};

export const emailAddressConfig = {
  title: "Email Address",
  fields: [
    {
      key: "emailAddressLabel",
      label: "Email Address Textbox Placeholder Text",
      hasInfo: false,
      defaultValue: "example@mail.com",
    },
  ],
};

export const customerDetailsConfig = {
  title: "Customer Details",
  fields: [
    {
      key: "fromLabel",
      label: "From",
      hasInfo: false,
      defaultValue: "from",
    },
    {
      key: "accountLinkLabel",
      label: "Account Link Text",
      hasInfo: false,
      defaultValue: "Account Link",
    },
    {
      key: "customerIdText",
      label: "Customer Id Text",
      hasInfo: false,
      defaultValue: "Customer Id",
    },
    {
      key: "helloNameText",
      label: "Hello Name Text",
      hasInfo: false,
      defaultValue: "Hello",
    },
    {
      key: "greetingText",
      label: "Greeting Text",
      hasInfo: false,
      defaultValue: "There,",
    },
  ],
};

export const customerPortalHtmlConfig = {
  title: "Customer Portal Html",
  fields: [
    {
      key: "customerPortalTopHtml",
      label: "Customer Portal Top HTML",
      hasInfo: false,
      defaultValue: "",
    },
    {
      key: "customerPortalBottomHtml",
      label: "Customer Portal Bottom HTML",
      hasInfo: false,
      defaultValue: "",
    },
  ],
};