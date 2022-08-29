import { module, test } from 'qunit';
import { setupRenderingTest } from 'tanky/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | game-board', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<GameBoard />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <GameBoard>
        template block text
      </GameBoard>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
