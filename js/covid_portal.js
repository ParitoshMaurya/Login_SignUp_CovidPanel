const api = 'https://api.covid19india.org/state_district_wise.json';
const state_list_box = document.querySelector('.states__list');
const covid_state_list_form = document.querySelector('.covid_state_names');
const stateSelectedHTML = document.querySelector('#state--selected');
const testedNumHTML = document.querySelector('#tested--num');
const confirmedNumHTML = document.querySelector('#confirmed--num');
const recoveredNumHTML = document.querySelector('#recovered--num');
const stateProgressBox = document.querySelector('.state__progress__box');
const accountInfo = document.querySelector('.account-info');
let covid_JSON_DATA; // This will contain Covid JSON DATA
let state_code_arr=[]; //This will contain all state code
let state_wise_percentageArr = []; // This will be used for graphical representation

// To set Account Name ----------------
(function(){
    let LoginAccMail = JSON.parse(localStorage.getItem('loginAcc')).loginMail;
    let AllAcountArr = JSON.parse(localStorage.getItem('account_detail'));
    let loginAccName, loginPhoneNum;
    AllAcountArr.forEach(account=>{
        if(account.emailID.toLowerCase()===LoginAccMail.toLowerCase()){
            loginAccName=account.firstName;
            loginPhoneNum=account.mobileNum;};
    });
    accountInfo.innerHTML=`<img src="../images/account.svg" class="ico-size"> ${loginAccName}
    `;
    accountInfo.setAttribute('title',`Mob: ${loginPhoneNum}`);
    
})()

// To Initialize ToolTip ----------------
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
//----------------------------------------
(async function(){
    let res = await fetch(api);
    covid_JSON_DATA = await res.json();
    for(state in covid_JSON_DATA){
        state_code_arr.push(covid_JSON_DATA[state].statecode);
    };
    const stateListGen = function(state_code_arr){
        state_code_arr.forEach(state=>{
            state_list_box.insertAdjacentHTML('beforeend',`
            <div class="state_component">
                <input type="checkbox" name="${state}" id="${state}" checked>
                <label for="${state}" class="ml-2">${state}</label>
            </div> 
            `); });
        
    };
    stateListGen(state_code_arr);
    Confirmed_N_RecoveredShow();
    graphGenerator();

    animateNum();
    
})() // This is Immediate Invoke Function to Fetch Data From API and Generate Markup
function displayNumSet(HTMLElememt, Value){
    HTMLElememt.innerHTML = Value;
}
function animateNum(){
    $('.count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}
function StateNumshow(){ //A functon To Show Number of states Selected
    let selectedStatesArr = [...new FormData(covid_state_list_form)];
    let selectedStatesNum = selectedStatesArr.length;
    displayNumSet(stateSelectedHTML,selectedStatesNum);
    return selectedStatesArr;
};


function Confirmed_N_RecoveredShow(){ // A funtiion to get total recovered and confirmed cases 
    let totalConfirmed=0, totalRecovered=0, totalDeceased=0; // For Overall Data
    state_wise_percentageArr = []
    let selectedState = StateNumshow().map(arr => arr[0]);
    for(let state in covid_JSON_DATA){
        let stateWiseCnfrm = 0; // For StateWise Data
        let stateWiseRecvr = 0; // For StateWise Data
        let districtData = covid_JSON_DATA[state]['districtData'];
        for (let district in districtData){
            let districtCovidDetails = districtData[district];
            if(selectedState.includes(covid_JSON_DATA[state].statecode)){
                stateWiseCnfrm+= districtCovidDetails.confirmed;
                stateWiseRecvr+= districtCovidDetails.recovered;
                totalConfirmed+= districtCovidDetails.confirmed;
                totalRecovered+= districtCovidDetails.recovered;
                totalDeceased+= districtCovidDetails.deceased; }
            else{
                stateWiseCnfrm+= districtCovidDetails.confirmed;
                stateWiseRecvr+= districtCovidDetails.recovered;
            };};
        // Calculating Percentage As per State
        let stateWiseTotal = stateWiseCnfrm + stateWiseRecvr;
        let stateWiseCnfrmPercentage = (stateWiseCnfrm / stateWiseTotal)*100 || 0;
        let stateWiseRecvrPercentage = (stateWiseRecvr / stateWiseTotal)*100 || 0;
        // Created An Array containing State Name and Confirm and Recover Data in % and with State Code
        state_wise_percentageArr.push([
            state,[stateWiseCnfrmPercentage, stateWiseRecvrPercentage],covid_JSON_DATA[state].statecode
        ]);

        };
    displayNumSet(confirmedNumHTML, totalConfirmed);
    displayNumSet(recoveredNumHTML, totalRecovered);
    displayNumSet(testedNumHTML, totalDeceased + totalRecovered + totalConfirmed);
};

covid_state_list_form.addEventListener('change',function(){
    Confirmed_N_RecoveredShow()
    graphGenerator();
})
function logOutUser(){
    localStorage.setItem('loginAcc','');
    window.location.href = '../index.html';
}
function graphGenerator(){
    stateProgressBox.innerHTML='';
    let selectedState = StateNumshow().map(arr => arr[0]);
    state_wise_percentageArr.forEach(StateArr=>{
        if(selectedState.includes(StateArr[2])){
            stateProgressBox.insertAdjacentHTML('afterbegin'
            ,`<div class="progress__component d-flex">
                    <div class="col-3 p-0 state--name">
                        ${StateArr[0]}
                    </div>
                    <div class="col-9">
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style="width: ${StateArr[1][0]}%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${StateArr[1][1]}%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            `);   
        }
    })

}