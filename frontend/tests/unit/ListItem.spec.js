import { shallowMount } from '@vue/test-utils';
import ListItem from '../../src/components/ListItem.vue';

describe('ListItem.vue', () => {
  it('renders props.item when passed', () => {
    const item = {
      id: 30,
      title: 'Pavilnys, Valdemaro Čarneckio g., mūrinis sublokuotas namas',
      link: 'https://www.aruodas.lt/namai-vilniuje-pavilnyje-valdemaro-carneckio-g-pavilnyje-v-carneckio-g-parduodamas-vieno-2-1262909/',
      price: 109000,
      area: 98,
      buildingStatus: 'Dalinė apdaila',
      new: true,
      starred: false,
      lastSeenAt: null,
      updatedAt: null,
      createdAt: '2020-04-25T13:11:23.823Z',
      lastPriceChanges: [],
      imagePath: 'https://aruodas-img.dgn.lt/object_66_88335899/nuotrauka.jpg',
      portalId: 3,
      portal: {
        id: 3,
        title: 'Aruodas',
        name: 'aruodas',
        link: 'https://aruodas.lt/',
        imagePath: 'images/aruodas.png',
        active: true,
        createdAt: '2020-04-12T21:46:14.952Z',
        updatedAt: '2020-04-12T21:46:14.952Z',
      },
    };
    const wrapper = shallowMount(ListItem, {
      propsData: { item },
    });
    expect(wrapper.text()).toMatch(item.title);
  });
});
