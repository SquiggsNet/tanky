import { module, test } from 'qunit';
import { setupRenderingTest } from 'tanky/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | is-equal', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders false', async function (assert) {
    this.set('inputValue', '1234');
    this.set('inputValueTwo', 'gdsgg');

    await render(hbs`{{is-equal this.inputValue this.inputValueTwo}}`);

    assert.dom(this.element).hasText('false');
  });

  test('it renders true', async function (assert) {
    this.set('inputValue', '1234');
    this.set('inputValueTwo', '1234');

    await render(hbs`{{is-equal this.inputValue this.inputValueTwo}}`);

    assert.dom(this.element).hasText('true');
  });

});
