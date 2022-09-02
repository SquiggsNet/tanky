import { helper } from '@ember/component/helper';

export default helper(function classList(params /*, named*/) {
  return params.filter((item) => item).join(' ') || undefined;
});
