import { helper } from '@ember/component/helper';
import { htmlSafe as _htmlSafe } from '@ember/template';

export default helper(function htmlSafe(params /*, named*/) {
  return _htmlSafe(params[0]);
});
