"use strict";
// dom elements
const validJson = document.getElementById("valid_json");
const invalidJson = document.getElementById("invalid_json");
const jsonInput = document.getElementById("json_input");
const mainElement = document.getElementById("mainEl");

jsonInput.addEventListener("keyup", function() {
  //check if there is data first
  if (this.value.trim() !== "") {
    //check if json is valid json
    try {
      JSON.parse(this.value);
    } catch (error) {
      validJson.classList.add("hidden");
      invalidJson.classList.remove("hidden");
      return;
    }
    ///////////////////////solve the problem////////////////////////////////
    const tree = JSONCracker(JSON.parse(this.value));
    treeTOhtml(tree);
  } else {
    mainElement.innerHTML = "";
  }
  //make json valid otherwise
  invalidJson.classList.add("hidden");
  validJson.classList.remove("hidden");
});

function JSONCracker(object) {
  // get the element type
  function typeOfElement(element, strictComparison = false) {
    if (strictComparison && Array.isArray(element)) return "array";
    if (typeof element === "object" && element !== null) return "object";
    else return "primitive";
  }
  // get the chosen data type or filter object
  function getDataType(object, type, strict) {
    const result = {};
    for (const key in object) {
      const element = object[key];
      const exceptions = key !== "parent" && key !== "type" && key !== "title";
      if (typeOfElement(element, strict) === type && exceptions) {
        result[key] = element;
      }
    }
    if (!Object.keys(result).length) return false;
    return result;
  }
  // set infos (give childs name of parent)
  function setInfos(object, parent) {
    for (const key in object) {
      const element = object[key];
      if (typeOfElement(element) === "object") {
        element["parent"] = parent;
        element["type"] = typeOfElement(element, true);
        // element["title"] = key;
      }
    }
  }
  // insialize empty tree and depth counters
  const tree = {};
  let i = 1;
  let j = 1;
  //main function to build tree object
  function main(object) {
    // happend at the first time
    if (i === 1) {
      setInfos(object, "1.1");
      tree["1"] = {
        1.1: {
          values: getDataType(object, "primitive"),
        },
      };
      i++;
      object = getDataType(object, "object");
    }
    if (object) {
      let obj2 = {};
      tree[i] = {};
      for (const key in object) {
        const ij = i + "." + j;
        const element = object[key];
        if (getDataType(element, "object")) {
          const helper = getDataType(element, "object");
          for (const key1 in helper) {
            [obj2[key1]] = Object.values(helper);
          }
        }
        let values = getDataType(element, "primitive");
        setInfos(element, ij);
        tree[i][ij] = {
          parent: element.parent,
          title: key,
          values: values,
          type: element.type,
        };
        j++;
      }
      j = 1;
      i++;
      if (Object.values(obj2).length) main(obj2);
    }
  }
  //invoke main
  main(object);
  return tree;
}

function treeTOhtml(tree) {
  // create layers: 5
  mainElement.innerHTML = "";
  for (const key1 in tree) {
    const element = tree[key1];
    mainElement.insertAdjacentHTML(
      "beforeend",
      `<div id=${key1} class=layer-element></div>`
    );
    const layer = document.getElementById(key1);
    for (const key2 in element) {
      const ele = element[key2];
      layer.insertAdjacentHTML(
        "beforeend",
        `<div id=${key2} class=subLayer-element></div>`
      );
      const subLayer = document.getElementById(key2);
      if (key1 > 1) {
        subLayer.insertAdjacentHTML(
          "beforeend",
          `<div class=title>${ele.title}</div>`
        );
      }
      subLayer.insertAdjacentHTML(
        "beforeend",
        `<div class="values circle"></div>`
      );
      const valuesList = document.querySelectorAll(`.values`);
      const values = valuesList[valuesList.length - 1];
      //check if box is empty and make it circul
      if (ele.values) values.classList.remove("circle");
      for (const key3 in ele.values) {
        const el = ele.values[key3];
        // color data based of types
        let valueColor = "";
        if (typeof el === "string" || el === null)
          valueColor = "text-[#dcddde]";
        if (typeof el === "boolean") valueColor = "text-purple-900";
        if (typeof el === "number") valueColor = "text-[#fd0079]";
        if (el === true) valueColor = "text-[#46c46e]";
        if (el === false) valueColor = "text-[#db662e]";
        values.insertAdjacentHTML(
          "beforeend",
          `<p class=box ><span class="objectKey text-[#59b8ff]">${key3} :</span><span class="objectValue ${valueColor}" > ${el}</span></p>`
        );
      }
    }
  }
}

async function newFile(){
  const input = document.createElement('input');
  input.style.visibility = 'hidden';
  input.type = 'file';
  input.onchange = e => { 
      // getting a hold of the file reference
      const file = e.target.files[0];
      // setting up the reader
      const reader = new FileReader();
      reader.readAsText(file,'UTF-8');
      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
          let content = readerEvent.target.result; // this is the content!
          document.getElementById('json_input').value = content;
          try {
            JSON.parse(content);
          } catch (error) {
            validJson.classList.add("hidden");
            invalidJson.classList.remove("hidden");
            return;
          }
          const tree = JSONCracker(JSON.parse(content));
          treeTOhtml(tree);
          invalidJson.classList.add("hidden");
          validJson.classList.remove("hidden");
      }
      
  }
  input.click();
}

function deleteJsonContent()
{
  document.getElementById('json_input').value = '';
  invalidJson.classList.add("hidden");
  validJson.classList.remove("hidden");
}
