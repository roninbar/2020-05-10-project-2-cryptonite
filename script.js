$(function () {
    $('#cards').empty();
    $.getJSON('https://api.coingecko.com/api/v3/coins/list')
        .done(function (coins) {
            $('#cards')
                .append(coins
                    .slice(2100, 2200)
                    .map(coin => $(`
                        <div class="card col-sm-6 col-md-4 col-lg-3 col-xl-2">
                            <div class="card-body">
                                <h5 class="card-title text-uppercase">${coin.symbol}</h5>
                                <div class="custom-control custom-switch" style="position: absolute; top: 22px; right: 25px;">
                                    <input type="checkbox" class="custom-control-input" id="${coin.id}">
                                    <label class="custom-control-label" for="${coin.id}"></label>
                                </div>
                                <p>${coin.name}</p>
                                <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#${coin.id}-more-info">
                                    More Info
                                </button>
                                <div class="collapse mt-4 more-info" id="${coin.id}-more-info">
                                    <div class="card border-primary p-4" style="border-radius: 200em 200em 0 0;">
                                        <img class="card-img-top img-thumbnail rounded-circle border-dark" src="img/dollar.gif" />
                                        <div class="card-body d-flex flex-column align-items-center">
                                            <div class="spinner-grow"></div>
                                            <div class="spinner-grow"></div>
                                            <div class="spinner-grow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`)));
            $('.more-info').on('shown.bs.collapse', function (e) {
                const match = e.target.id.match(/(.*)-more-info/);
                if (match.length < 2) {
                    throw new Error(`${e.target.id} doesn't match expected pattern /(.*)-more-info/.`);
                } else {
                    $.getJSON(`https://api.coingecko.com/api/v3/coins/${match[1]}?tickers=false&community_data=false&developer_data=false`)
                        .done(function (info) {
                            const cardImg = $('.card-img-top', e.target);
                            cardImg.attr('src', info.image.large);
                            const cardBody = $('.card-body', e.target);
                            cardBody.empty();
                            cardBody.append(`<h5 class="card-text text-center">&dollar;${info.market_data.current_price.usd}</h5>`);
                            cardBody.append(`<h5 class="card-text text-center">&pound;${info.market_data.current_price.usd}</h5>`);
                            cardBody.append(`<h5 class="card-text text-center">&#8362;${info.market_data.current_price.usd}</h5>`);
                        });
                }
            });
        });
});