import axios from 'axios';
import 'babel-polyfill';

const getSelectedValue = (elm) => elm.options[elm.options.selectedIndex].value;

const clearOptions = elm => {
  Array.from(elm.options)
    .filter((o) => o.value !== '')
    .forEach((o) => o.remove());
};

const populateOptions = (elms, options) => {
  elms.forEach((elm) => {
    elm.removeAttribute('disabled');
    const selectedValue = getSelectedValue(elm) || null;
    clearOptions(elm);
    options.forEach((opt) => {
      const option = document.createElement('option');
      option.appendChild(document.createTextNode(opt.name));
      option.value = opt._id;
      if (opt._id === selectedValue) option.selected = true;
      elm.appendChild(option);
    });
  });
};

const filterData = async (e) => {
  const { name } = e.currentTarget;
  const value = getSelectedValue(e.target);
  if (!value) {
    //disable all selectors below this element
    const filterSelectors = Array.from(document.querySelectorAll('[data-filtered="true"]'));
    const currentIndex = filterSelectors.findIndex(s => s === e.target);
    filterSelectors.forEach((s, i) => {
      if (i > currentIndex) {
        clearOptions(s);
        s.setAttribute('disabled', 'disabled');
      }
    })
    return;
  };
  if (!['brandId', 'collectionId'].includes(name)) return;
  const collection = name === 'brandId' ? 'brand' : 'collection';
  const url = `/api/${collection}/${value}`;
  document
    .querySelectorAll('select')
    .forEach((selector) => selector.setAttribute('disabled', 'disabled'));

  try {
    const { data } = await axios.get(url);
    document.querySelectorAll('select[data-control]').forEach(selector => selector.removeAttribute('disabled'));
    Object.entries(data).forEach(([key, options]) => {
      if (!['collectionId', 'finishId', 'colourId'].includes(key)) return;
      const selectors = document.querySelectorAll(`select[name=${key}]`);
      if (!selectors) return;
      populateOptions(selectors, options);
    });
  } catch (err) {
    console.log(err);
  }
};

const addEventHandlers = () => {
  const dataControllers = document.querySelectorAll('select[data-control]');
  if (!dataControllers) return;
  dataControllers.forEach((control) =>
    control.addEventListener('change', filterData)
  );
};

export default addEventHandlers;
