export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE =
  'Your string fails to match the Object Id pattern'
export const PHONE_NUMBER_RULE = /^\d{10}$/
export const PHONE_NUMBER_RULE_MESSAGE = (field) =>
  '`' + field + '` must be 10 digits'
export const PASSWORD_RULE =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&_.])[a-zA-Z\d@$!%*?&_.]+$/
export const PASSWORD_RULE_MESSAGES = {
  SPECIAL_CHAR:
    '`password` must contain at least 1 special character from the following list: `@`, `$`, `!`, `%`, `*`, `?`, `&`, `_`, `. `',
  MIN_LENGTH: '`password` must have at least 6 characters'
}
