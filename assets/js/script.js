jQuery(function($) {

    /**
     * Слайдер
     */
    if ($('.b-slider').length) {
        $('.b-slider').slick({
            slidesToShow: 1,
            dots: false,
            nav: true,
            prevArrow: '<div class="prev">',
            nextArrow: '<div class="next">',
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 700,
        });
    }

    /**
     * Заявка
     */
    $('.b-product-item__btn-order').click(function(e) {
        e.preventDefault();
        var modal = $('.b-modal-order');
            id = $(this).closest('.b-product-item').data('id'),
            option = modal.find('.jq-selectbox__dropdown [data-id="' + id + '"]');

        option.click();
        //console.log(option);
        modal.find('.b-form').show();
        $('.b-modal-order').addClass('b-visible');
    });

    $('.b-modal-order__close').click(function() {
        $('.b-modal-order').removeClass('b-visible');
    });

    $('.b-modal-order').click(function(e) {
        if ($(e.target).hasClass('b-modal-order')) {
            $('.b-modal-order').removeClass('b-visible');
        }
    });

    $('.b-modal-order select').styler();

    $('.b-modal-order :radio').on('click', function() {
        var radious = $(this).closest('form').find(':radio[name="'+ $(this).attr('name') +'"]').not(this);

        if ($(this).hasClass('checked')) {
            $(this).removeClass('checked');
            $(this).removeClass('unchecked');
            $(this).prop('checked', false);
            radious.removeClass('unchecked')
        } else {
            $(this).addClass('checked');
            $(this).removeClass('unchecked');
            radious.addClass('unchecked')
            radious.removeClass('checked')
        }
    });


    $('.b-modal-order .b-input-kg').inputmask("numeric", {
        alias: 'percentage',
        suffix: " кг",
        min: 0,
        max: 50000
    });

    $('.b-modal-order .b-input-m').inputmask("numeric", {
        alias: 'percentage',
        suffix: " м",
        min: 0,
        max: 200
    });

    /**
     * Видео
     */
    let video = $('.b-video__video');
    $('.b-video__link').click(function(e) {
        e.preventDefault();
        video.attr("src", video.attr("src") + "&autoplay=1");
        $('.b-video__link').animate({opacity: 0}, 300, function() {
            $(this).hide();
        });
    });

    //let btn = jQuery('iframe')[0].contentWindow.document.body.querySelector('.ytp-button.ytp-share-button');;


    /**
     * Отмена прокрутки в схеме и корзине
     */
    $('.x-detail').on('click', 'area', function(e) {
        e.preventDefault();
    });

    $('.panel-cart').on('click', '.btn-cart', function(e) {
        e.preventDefault();
    });

    // FIXME: не работает на svg
    /*$('.x-detail area').draggable({
        containment: '[itemprop="articleBody"]',
        drag: function(event) {
            //console.log(event);
            var top = event.offsetY;
            var left = event.offsetX;

            $(this).attr('coords', left + "," + top + ",12");
            console.log(left + "," + top + ",12");
        },
    });*/


    /**
     * Корзина
     */
    if (!$('.panel-cart tbody').length) {
        $('.panel-cart table thead').after('<tbody>');
    }

    let rowTemplate = $('<tr>\
        <td class="x-sku"></td>\
        <td class="x-name"></td>\
        <td class="x-price"></td>\
        <td class="x-count"><a href="#" class="x-minus">-</a>\
            <span class="x-count__num">1</span>\
            <a href="#" class="x-plus">+</a></td>\
        <td class="x-sum"></td>\
        <td><a href="#" class="x-delete">×</a></td>\
        </tr>'),
        cart = $('.panel-cart'),
        table = $('.panel-cart tbody'),
        initCartState = false;

    table.find('tr').remove();

    function init() {
        let store = JSON.parse(localStorage.getItem('cart-details'));

        changeCartState(store);

        $.each(store, function(name, data) {
            let row = rowTemplate.clone();
            //let sum = (data.price.replace('£', '') * data.count).toFixed(2);
            row.find('.x-sku').text(data.sku);
            row.find('.x-name').text(name);
            row.find('.x-price').text(data.price);
            row.find('.x-count__num').text(data.count);
            row.find('.x-sum').text(data.sum);
            table.append(row);
        });

        cart.append('<a href="/order" class="x-btn">Оформить заказ</a>');
    };

    init();

    function changeCartState(store) {
        if (!initCartState) {
            initCartState = true;
            cart.find('.product_info + h6').addClass('title');
            cart.find('.title').after('<h6 class="title-empty">Корзина пуста</h6>');
        }

        if (store && Object.keys(store).length) {
            cart.addClass('is-fill');
        } else {
            cart.removeClass('is-fill');
        }
    };

    // Добавить в корзину
    // По клику
    $('.x-detail').on('click', 'area', function(e) {
        e.preventDefault();
        let id = $(this).attr('id'),
            elem = $('div#product_' + id).eq(0);

        if (elem.find('select').length) {
            elem = elem.find('select option').eq(0);
            clickBtnSelect(elem.text());
        } else {
            elem = elem.find('p');
            clickBtnCart(elem.text());
        }
    });

    // По кнопке
    $('.panel-cart').on('click', '.btn-cart', function(e) {
        let text = $('.panel-cart span.product_info p').text();
        clickBtnCart(text);
    });

    function clickBtnCart(text) {
        let index = text.lastIndexOf("-"),
            sku,
            name = text.slice(0, index).trim(),
            price = text.slice(index + 2),
            row = rowTemplate.clone();

        sku = name.match(/^[a-zA-Z0-9.]+/)[0];
        name = name.slice(sku.length).trim();
        if (name[0] == '-') {
            name = name.slice(1).trim();
        }

        row.find('.x-sku').text(sku);
        row.find('.x-name').text(name);
        row.find('.x-price').text(price);
        row.find('.x-sum').text(price);

        let exists = table.find('.x-name:contains("' + name + '")');

        if (exists.length) {
            exists.closest('tr').find('.x-plus').click();
        } else {
            table.append(row);
            save(row);
        }
    }

    // По выбору в списке
    $('.panel-cart').on('click', 'form button', function(e) {
        e.preventDefault();
        let text = $('.panel-cart span.product_info :selected').text();
        clickBtnSelect(text);
    });

    function clickBtnSelect(text) {
        let index = text.lastIndexOf(":"),
            sku,
            name = text.slice(0, index).trim(),
            price = text.slice(index + 2),
            row = rowTemplate.clone();

        sku = name.match(/^[a-zA-Z0-9.]+/)[0];
        name = name.slice(sku.length).trim();
        if (name[0] == '-') {
            name = name.slice(1).trim();
        }

        row.find('.x-sku').text(sku);
        row.find('.x-name').text(name);
        row.find('.x-price').text(price);
        row.find('.x-sum').text(price);

        let exists = table.find('.x-name:contains("' + name + '")');

        if (exists.length) {
            exists.closest('tr').find('.x-plus').click();
        } else {
            table.append(row);
            save(row);
        }
    }

    // Добавить в корзину со страницы детали
    $('.x-product__addtocart').on('click', function(e) {
        let isProduct = $(this).closest('.x-product').length,
            row = rowTemplate.clone(),
            sku,
            name,
            price,
            count;

        if (isProduct) {
            name = $('.x-product__title').data('fullname');
            price = parseFloat($('.x-product__price').text().trim().slice(4).replace(',', '.'));
            count = $('.x-product__count-input').val() * 1;
        } else {
            let parent = $(this).closest('.x-products-item');
            name = $('.x-products-item__title', parent).data('fullname');
            price = parseFloat($('.x-products-item__price', parent).text().trim().slice(4).replace(',', '.'));
            count = $('.x-product__count-input', parent).val() * 1;
        }

        if (!price) {
            price = 0;
        }

        sku = name.match(/^[a-zA-Z0-9.]+/)[0];
        name = name.slice(sku.length).trim();
        if (name[0] == '-') {
            name = name.slice(1).trim();
        }

        row.find('.x-sku').text(sku);
        row.find('.x-name').text(name);
        row.find('.x-price').text('£' + price);
        row.find('.x-count__num').text(count);
        row.find('.x-sum').text('£' + price * count);

        let exists = table.find('.x-name:contains("' + name + '")');

        if (exists.length) {
            let curCount = exists.closest('tr').find('.x-count__num').text() * 1;
            exists.closest('tr').find('.x-count__num').text(curCount + count - 1);
            exists.closest('tr').find('.x-plus').click();
        } else {
            table.append(row);
            save(row);
        }
    });

    // Количество
    $('.panel-cart').on('click', '.x-minus', function(e) {
        e.preventDefault();
        let elem = $(this).parent().find('.x-count__num'),
            value = elem.text() * 1;

        value--;
        if (value <= 0) {
            value = 1;
        }
        elem.text(value);
        updatePrice($(this).closest('tr'));
    });

    $('.panel-cart').on('click', '.x-plus', function(e) {
        e.preventDefault();
        let elem = $(this).parent().find('.x-count__num'),
            value = elem.text();

        elem.text(++value);
        updatePrice($(this).closest('tr'));
    });

    function updatePrice(row) {
        let sum = (row.find('.x-price').text().replace('£', '') * row.find('.x-count__num').text()).toFixed(2);
        row.find('.x-sum').text('£' + sum);

        save(row);
    };

    // Удалить
    $('.panel-cart').on('click', '.x-delete', function(e) {
        e.preventDefault();
        let row = $(this).closest('tr');
        remove(row);
        row.remove();
    });

    // Хранилище
    function save(row) {
        let sku = row.find('.x-sku').text(),
            name = row.find('.x-name').text(),
            price = row.find('.x-price').text(),
            count = row.find('.x-count__num').text(),
            sum = row.find('.x-sum').text();

        if (!localStorage.getItem('cart-details')) {
            localStorage.setItem('cart-details', JSON.stringify({}));
        }

        let store = localStorage.getItem('cart-details');
        store = JSON.parse(store);
        store[name] = {
            sku,
            price,
            count,
            sum,
        };

        localStorage.setItem('cart-details', JSON.stringify(store));
        //console.log(localStorage);

        changeCartState(store);
    };

    function remove(row) {
        let name = row.find('.x-name').text();

        if (!localStorage.getItem('cart-details')) {
            localStorage.setItem('cart-details', JSON.stringify({}));
        }

        let store = localStorage.getItem('cart-details');
        store = JSON.parse(store);
        delete store[name];

        localStorage.setItem('cart-details', JSON.stringify(store));
        //console.log(localStorage);

        changeCartState(store);
    };

    // Переключение
    $('.panel-out').click(function() {
        $(this).hide();
        $('.panel-cart').hide();
        $('.panel-in').show();
    });

    $('.panel-in').click(function() {
        $(this).hide();
        $('.panel-cart').show();
        $('.panel-out').show();
    });

    /**
     * Оформление заказа
     */
    if ($('.b-model-order').length) {
        let order = $('.b-model-order'),
            rowTemplate = $('<div class="x-items__item">'),
            store = JSON.parse(localStorage.getItem('cart-details')),
            //tdStyle = 'style="border: 1px solid; padding: 5px;"',
            showPrice = !$('body').hasClass('x-hidden-price'),
            html = '<table style="border-collapse: collapse; text-align: center;" ><tr> <th style="border: 1px solid; padding: 5px;">Артикул</th> <th style="border: 1px solid; padding: 5px;">Наименование</th> <th style="border: 1px solid; padding: 5px;">Количество</th>';

        if (showPrice) {
            html += '<th style="border: 1px solid; padding: 5px;">Цена</th>';
        }
        html += '</tr>';

        $.each(store, function(name, data) {
            /*let row = rowTemplate.clone(),
                str = data.sku + ' ' + name + ' (Кол-во: ' + data.count;
            if (showPrice) {
                str += ', Цена: ' + data.sum;
            }
            str += ')';
            row.text(str);
            order.find('.x-items').append(row);*/

            html += '<tr> <td style="border: 1px solid; padding: 5px;">' + data.sku + '</td> <td style="border: 1px solid; padding: 5px;">' + name + '</td> <td style="border: 1px solid; padding: 5px;">' + data.count + '</td>';
            if (showPrice) {
                html += '<td style="border: 1px solid; padding: 5px;">' + data.sum + '</td>'
            }
            html += '</tr>';
        });

        html += '</table>';

        let products = order.find('[name="data[products]"]');
        products.val(html);
        order.find('.x-items').html(html);

        if (store) {
            order.find('.x-total span').text(Object.keys(store).length);
        }
    }

    /**
     * Количество
     */
    {
        $('.x-product__count-plus').click(function() {
            let input = $(this).parent().find('.x-product__count-input'),
                val = input.val();
            input.val(++val);
        });

        $('.x-product__count-minus').click(function() {
            let input = $(this).parent().find('.x-product__count-input'),
                val = input.val();
            if (--val <= 0) {
                val = 1;
            }
            input.val(val);
        });
    }


    /**
     * Ajax поиск деталей
     */
    {
        let search = $('.b-header-search'),
            form = $('.b-header-search form'),
            results = $('.b-header-search__results');

        new SimpleBar($('#b-header-search__results')[0]);

        $('[type=submit]', search).click(function(e) {
            if (search.hasClass('b-open')) {
                //search.removeClass('b-open');
            } else {
                e.preventDefault();
                search.addClass('b-open');
            }
        });


        /*$('body').click(function(e) {
            if (!$(e.target).closest('.b-header-search').length) {
                search.removeClass('b-open');
            }
        });*/

        function searchDetails() {
            let formData = form.serialize();

            $.ajax({
                url: form.attr('action'),
                data: formData,
                type: 'POST',
                dataType: 'html',
                success: function(data, status, xhr) {
                    let html = $('<ul>');
                    dataProducts = $(data).find('.x-products-item');

                    results.find('.simplebar-content').empty();

                    dataProducts.each(function(i) {
                        let title = $(this).find('h2 a'),
                        li = $('<li>');

                        li.append(title);
                        html.append(li);

                        if (i + 1 == 10) {
                            return false;
                        }
                    });

                    let link = $('<a></a>').attr('href', form.attr('action') + '?' + formData).text('Смотреть все результаты');
                    link.wrap('<li>');
                    html.append(link);

                    if (dataProducts.length) {
                        search.addClass('b-results');
                    } else {
                        search.removeClass('b-results');
                    }

                    results.find('.simplebar-content').append(html);
                    data = null;
                },
                error: function(xhr, status) {
                    console.log(status);
                },
            });
        };

        form.on('submit', function(e) {
            if (search.find("[type=text]").width() == 0) {
                e.preventDefault();
            }
        });

        $('[type=text]', search).on('input', function(e) {
            searchDetails();
        });

        $(window).resize(function() {
            if ($(this).width() < 1024) {
                search.removeClass('b-open');
            }
        }).resize();
    }


    /**
     * Моб меню
     */
    let nav = $('.b-header .col-nav');

    $('.b-toggle-nav').click(function() {
        nav.toggleClass('b-open');
    });

    nav.find('a').click(function(e) {
        if ($(window).width() > 768) {
            return;
        }

        if ($(this).parent().find('ul').length) {
            if (!$(this).hasClass('b-open')) {
                e.preventDefault();
                $(this).addClass('b-open');
            }
        }
    });

    /**
     * Скролл
     */

     function changeSize() {
       var width = parseInt($("#Width").val());
       var height = parseInt($("#Height").val());

       if(!width || isNaN(width)) {
         width = 600;
       }
       if(!height || isNaN(height)) {
         height = 400;
       }
       $("#scroll").width(width).height(height);

       // update perfect scrollbar
       Ps.update(document.getElementById('scroll'));
     }
     $(function() {
       Ps.initialize(document.getElementById('scroll'));
     });


    /**
     * Калькулятор
     */
    $('.x-calculator select').select2({
        //placeholder: "Сортировать",
        width: 'auto',
        dropdownAutoWidth: true,
    });
});
