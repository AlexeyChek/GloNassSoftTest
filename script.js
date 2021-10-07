'use strict';

const tables = document.querySelector('.tables'),
  tableOneBody = tables.querySelector('.tables__one tbody'),
  tableTwoBody = tables.querySelector('.tables__two tbody'),
  tableThreeBody = tables.querySelector('.tables__three tbody'),
  diagramOne = document.getElementById('diagram-one'),
  diagramTwo = document.getElementById('diagram-two'),
  diagramThree = document.getElementById('diagram-three');

let dataOne = [],
  dataTwo = [],
  dataThree = [];

const deleteRow = target => {
  target.closest('tr').remove();
};

const addRow = target => {
  target.closest('tr').insertAdjacentHTML('beforebegin',
  '<tr><td><input type="number"></td><td><input type="number"></td><td><button class="delete">Delete</button></td></tr>');
};

const getData = (table) => {
  const rows = table.querySelectorAll('tr');
  let x, y;
  const data = [];

  for (let i = 0; i < rows.length - 1; i++) {
    const inputElems = rows[i].querySelectorAll('input');
    x = +inputElems[0].value || 0;
    y = +inputElems[1].value || 0;
    data.push([x, y]);
  }

  return data;
};

const getMean = (x, y) => {
  return ((x + y) / 2);
};

const getResult = (one, two) => {
  const data = [];

  for (let i = 0; i < one.length && i < two.length; i++) {
    data.push( [ getMean(one[i][0], two[i][0]), getMean(one[i][1], two[i][1]) ] );
  }

  return data;
};

const createTable = (data) => {
  tableThreeBody.textContent = '';

  for (let numbers of data) {
    tableThreeBody.insertAdjacentHTML('beforeend', 
    `
      <tr>
        <td>
          <input type="number" value="${numbers[0]}">
        </td>
        <td>
          <input type="number" value="${numbers[1]}">
        </td>
      </tr>
    `);
  }
};

const drawDiagram = (data, diagram) => {
  if (data.length === 0) return;

  const ctx = diagram.getContext('2d');
  ctx.clearRect(0, 0, diagram.width, diagram.height);
  
  let minX = data[0][0],
    maxX = data[0][0],
    minY = data[0][1],
    maxY = data[0][1],
    stepX,
    stepY;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] < minX) minX = data[i][0];
    if (data[i][0] > maxX) maxX = data[i][0];
    if (data[i][1] < minY) minY = data[i][1];
    if (data[i][1] > maxY) maxY = data[i][1];
  }

  minX = Math.floor(minX);
  maxX = Math.ceil(maxX);
  minY = Math.floor(minY);
  maxY = Math.ceil(maxY);

  if (minX === maxX) {
    minX = minX - 1;
    maxX = maxX + 1;
  }
  
  if (minY === maxY) {
    minY = minY - 1;
    maxY = maxY + 1;
  }  

  stepX = 220 / (maxX - minX);
  console.log('stepX: ', stepX);
  stepY = 220 / (maxY - minY);
  console.log('stepY: ', stepY);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';

  ctx.beginPath();
  ctx.moveTo(40, 40);
  ctx.lineTo(40, 260);
  ctx.lineTo(260, 260);
  ctx.stroke();

  ctx.fillText('Y', 37, 30);
  ctx.fillText('X', 270, 263);

  for (let val of data) {
    ctx.beginPath();
    ctx.moveTo(35, (260 - (val[1] - minY) * stepY));
    ctx.lineTo(45, (260 - (val[1] - minY) * stepY));
    ctx.stroke();
    ctx.fillText(val[1], 10, (260 - (val[1] - minY) * stepY));

    ctx.beginPath();
    ctx.moveTo((40 + (val[0] - minX) * stepX), 255);
    ctx.lineTo((40 + (val[0] - minX) * stepX), 265);
    ctx.stroke();
    ctx.fillText(val[0], (35 + (val[0] - minX) * stepX), 275);

    ctx.beginPath();
    ctx.moveTo((40 + (val[0] - minX) * stepX), (260 - (val[1] - minY) * stepY));
    
    ctx.fill();
  }

  ctx.strokeStyle = 'blue';
  ctx.fillStyle = 'blue';

  for (let val of data) {
    ctx.beginPath();
    ctx.arc((40 + (val[0] - minX) * stepX), (260 - (val[1] - minY) * stepY), 5, 0, Math.PI*2,true);
    ctx.fill();
  }

  ctx.lineWidth = 4;
  ctx.strokeStyle = 'tomato';
  ctx.fillStyle = 'tomato';
  
  for (let i=0; i < data.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo((40 + (data[i][0] - minX) * stepX), (260 - (data[i][1] - minY) * stepY));
    ctx.lineTo((40 + (data[i + 1][0] - minX) * stepX), (260 - (data[i + 1][1] - minY) * stepY));
    ctx.stroke();
  }

};

const drawDiagrams = () => {
  drawDiagram(dataOne, diagramOne);
  drawDiagram(dataTwo, diagramTwo);
  drawDiagram(dataThree, diagramThree);
};

const calculate = () => {
  dataOne = getData(tableOneBody);
  dataTwo = getData(tableTwoBody);

  dataThree = getResult(dataOne, dataTwo);

  createTable(dataThree);

  drawDiagrams();
};

tables.addEventListener('click', event => {
  const target = event.target.closest('button');

  if (target && target.classList.contains('delete')) deleteRow(target);
  if (target && target.classList.contains('add')) addRow(target);
  if (target && target.classList.contains('calculate')) calculate();
});

