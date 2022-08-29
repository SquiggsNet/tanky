import { helper } from '@ember/component/helper';

export default helper(function isEqual(params /*, named*/) {
  return params[0] === params[1];
});
