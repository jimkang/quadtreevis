function createOneAt(selectedClass) {
  var selector = {
    selectedId: null
  };

  selector.selectElementWithId = function selectElementWithId(id) {
    if (selector.selectedId) {
      document.getElementById(selector.selectedId)
        .classList.remove(selectedClass);
    }

    var selectedEl = document.getElementById(id);
    if (selectedEl) {
      selector.selectedId = id;
      selectedEl.classList.add(selectedClass);
    }
  }
  
  return selector; 
}
