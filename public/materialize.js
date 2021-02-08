document.addEventListener('DOMContentLoaded', function () {
    const sidenav = document.querySelectorAll('.sidenav');//materialize sidenav
    const sidenavInstances = M.Sidenav.init(sidenav, {
        edge: 'right',
        closeOnClick: true
        //menuWidth: 300
    });
    
    const select = document.querySelectorAll('select');//materialize select
    const selectInstances = M.FormSelect.init(select, {});
    // var instance = M.FormSelect.getInstance(select);
    // const temp = select.getSelectedValues();
    // console.log('t!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!emp');
    // console.log(temp);
})
