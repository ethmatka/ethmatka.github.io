$(document).ready(function(){
  if(typeof web3 != "undefined"){
    $('#metamask-info').show();
    $('#betting-area').show();
    var account = web3.eth.accounts[0];
    // TODO : handle null account value, locked account
    web3.eth.getBalance(account, function(error, result){ 
      // TODO : handle error
      var balance = result.c[0] / 10000;
      $('#metamask-account').html(account);
      $('#metamask-balance').html(balance.toString()+ ' ETH');
    });


    betting_contract.LimitA(function(error, result){
      $('#limitA').html(result.c[0] / 10000);
    });

    betting_contract.LimitB(function(error, result){
      $('#limitB').html(result.c[0] / 10000);
    });

    betting_contract.betAmountsA(account, function(error, result){
      $('#my-betA').html(result.c[0] / 10000);
    });

    betting_contract.betAmountsB(account, function(error, result){
      $('#my-betB').html(result.c[0] / 10000);
    });


    $("#betA").on('change textInput input',function(ev){
      var bet_amount = parseFloat($("#betA").val());
      console.log(bet_amount);
      if(isNaN(bet_amount)){
        $('#payoutA').html('-');
      }
      else {
        var multiplier = parseFloat($('#multiplierA').data('value'));
        $('#payoutA').html((Math.round(multiplier*bet_amount * 1000) / 1000).toString());
      }
    });

    $("#placeBetA").on('click', function(e){
      var bet_amount = $("#betA").val();
      betting_contract.betA({
        gas: 300000,
        from: account,
        value: web3.toWei(bet_amount, 'ether')
      },function(err, result){
        if(!err)
          alert('Your bet was successfully placed');
      });
    });

    $("#betB").on('change textInput input',function(ev){
      var bet_amount = parseFloat($("#betB").val());
      console.log(bet_amount);
      if(isNaN(bet_amount)){
        $('#payoutB').html('-');
      }
      else {
        var multiplier = parseFloat($('#multiplierB').data('value'));
        $('#payoutB').html((Math.round(multiplier*bet_amount * 1000) / 1000).toString());
      }
    });

    $("#placeBetB").on('click', function(e){
      var bet_amount = $("#betB").val();
      betting_contract.betB({
        gas: 300000,
        from: account,
        value: web3.toWei(bet_amount, 'ether')
      },function(err, result){
        if(!err){
          alert('Your bet was successfully placed');
        }
      });
    });

    // $("#dropbtn").on('click',function(ev){
    //   var bet_amount = $("#dropinput").val();
    //   ContractInstance.betB({
    //     gas: 300000,
    //     from: web3.eth.accounts[0],
    //     value: web3.toWei(bet_amount, 'ether')
    //   },function(err, result){
    //     console.log(result);
    //   });
    // });

  }
  else {
    $('#metamask-missing').modal('show');
  }

});

