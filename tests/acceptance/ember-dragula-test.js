import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { simulateDragAndDrop } from '@zestia/ember-dragula/utils/simulate-drag-drop';
import { click, find, findAll, visit, currentURL } from '@ember/test-helpers';

module('Acceptance | ember-dragula', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /ember-dragula', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(findAll('.list-1 .item')[0].textContent, 'Item 1');
    assert.equal(findAll('.list-1 .item')[1].textContent, 'Item 2');
    assert.equal(findAll('.list-1 .item')[2].textContent, 'Item 3');
    assert.equal(findAll('.list-2 .item')[0].textContent, 'Item 4');
    assert.equal(findAll('.list-2 .item')[1].textContent, 'Item 5');
    assert.equal(findAll('.list-2 .item')[2].textContent, 'Item 6');
  });

  test('dragging objects', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    const elemDrag = findAll('.list-1 .item')[0];

    const elemDrop = find('.list-2');

    assert.equal(findAll('.list-1 .item').length, 3);
    assert.equal(findAll('.list-2 .item').length, 3);

    simulateDragAndDrop(elemDrag, elemDrop);

    assert.equal(findAll('.list-1 .item').length, 2);
    assert.equal(findAll('.list-2 .item').length, 4);
  });

  test('accepts dragula options', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');

    // Test passing copy option

    const elemDrag = findAll('.list-copy-1 .item')[0];
    const elemDrop = find('.list-copy-2');

    assert.equal(findAll('.list-copy-1 .item').length, 3);
    assert.equal(findAll('.list-copy-2 .item').length, 3);

    simulateDragAndDrop(elemDrag, elemDrop);

    assert.equal(findAll('.list-copy-1 .item').length, 3);
    assert.equal(findAll('.list-copy-2 .item').length, 4);

    // Test passing move function as option

    const unDraggableElem = findAll('.list-moves-1 .item')[0];
    const unDraggableElemDrop = find('.list-moves-2');

    assert.equal(findAll('.list-moves-1 .item').length, 3);
    assert.equal(findAll('.list-moves-2 .item').length, 3);

    simulateDragAndDrop(unDraggableElem, unDraggableElemDrop);

    assert.equal(findAll('.list-moves-1 .item').length, 3);
    assert.equal(findAll('.list-moves-2 .item').length, 3);
  });

  test('Removing an item without dragging', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(findAll('.list-for-removal .item').length, 3);

    await click('.list-for-removal .item:nth-child(2) button');

    assert.equal(findAll('.list-for-removal .item').length, 2);
    assert.equal(findAll('.list-for-removal .item .item-name')[0].textContent.trim(), 'Item 1');
    assert.equal(findAll('.list-for-removal .item .item-name')[1].textContent.trim(), 'Item 3');
  });

  test('Removing item 2 after dragging', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(findAll('.list-for-removal .item').length, 3);

    const elemDrag = find('.list-for-removal .item:nth-child(2)');
    const elemDrop = find('.list-for-removal .item:nth-child(1)');

    // Drag 2 onto 1
    simulateDragAndDrop(elemDrag, elemDrop);

    // Items 1 and 2 should be swapped
    assert.equal(findAll('.list-for-removal .item .item-name').length, 3);
    assert.equal(findAll('.list-for-removal .item .item-name')[0].textContent.trim(), 'Item 2');
    assert.equal(findAll('.list-for-removal .item .item-name')[1].textContent.trim(), 'Item 1');
    assert.equal(findAll('.list-for-removal .item .item-name')[2].textContent.trim(), 'Item 3');

    // Remove item 2 (now in first position)
    await click('.list-for-removal .item:nth-child(1) button');

    // Item 2 should be missing
    assert.equal(findAll('.list-for-removal .item .item-name').length, 2);
    assert.equal(findAll('.list-for-removal .item .item-name')[0].textContent.trim(), 'Item 1');
    assert.equal(findAll('.list-for-removal .item .item-name')[1].textContent.trim(), 'Item 3');
  });

  test('Removing item 1 after dragging', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(findAll('.list-for-removal .item').length, 3);

    const elemDrag = find('.list-for-removal .item:nth-child(2)');
    const elemDrop = find('.list-for-removal .item:nth-child(1)');

    // Drag 2 onto 1
    simulateDragAndDrop(elemDrag, elemDrop);

    // Items 1 and 2 should be swapped
    assert.equal(findAll('.list-for-removal .item .item-name').length, 3);
    assert.equal(findAll('.list-for-removal .item .item-name')[0].textContent.trim(), 'Item 2');
    assert.equal(findAll('.list-for-removal .item .item-name')[1].textContent.trim(), 'Item 1');
    assert.equal(findAll('.list-for-removal .item .item-name')[2].textContent.trim(), 'Item 3');

    // Remove item 1 (now in second position)
    await click('.list-for-removal .item:nth-child(2) button');

    // Item 1 should be missing
    assert.equal(findAll('.list-for-removal .item .item-name').length, 2);
    assert.equal(findAll('.list-for-removal .item .item-name')[0].textContent.trim(), 'Item 2');
    assert.equal(findAll('.list-for-removal .item .item-name')[1].textContent.trim(), 'Item 3');
  });
});
