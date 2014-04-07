function createOneAt(selectedClass) {
  var selector = {
    selectedId: null
  };

  selector.selectElementWithId = function selectElementWithId(id) {
    if (selector.selectedId) {
      document.getElementById(selector.selectedId)
        .classList.remove(selectedClass);
    }
    selector.selectedId = id;
    document.getElementById(selector.selectedId)
      .classList.add(selectedClass);
  }
  
  return selector; 
}

