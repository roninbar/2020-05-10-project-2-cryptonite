$(function () {
    $.getJSON('https://api.coingecko.com/api/v3/coins/list')
        .done(function (coins) {
            $('#cards').empty();
            $('#cards')
                .append(coins
                    .slice(2100, 2200)
                    .map(coin => $(`
                        <div class="card col-sm-6 col-md-4 col-lg-3 col-xl-2">
                            <div class="card-body">
                                <h5 class="card-title">${coin.symbol}</h5>
                                <div class="custom-control custom-switch" style="position: absolute; top: 22px; right: 25px;">
                                    <input type="checkbox" class="custom-control-input" id="customSwitch1">
                                    <label class="custom-control-label" for="customSwitch1"></label>
                                </div>
                                <p>${coin.name}</p>
                                <button class="btn btn-primary" type="button">More Info</button>
                            </div>
                        </div>`)));
        });
});