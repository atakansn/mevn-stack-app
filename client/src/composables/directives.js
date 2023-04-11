function formatValue(input) {
    input = input.replace(/\D/g, '');
    if (input.length > 0) {
        input = input.match(/(\d{1,2})(\d{0,2})/);
        input = input[1] + (input[2] ? ' / ' + input[2] : '');
    }

    return input;
}

function formatValue2(input) {
    input = input.replace(/\D/g, '');
    input = input.slice(0, 3);
    return input;
}
export default {
    cardNumber: {
        beforeMount(el) {
            el.addEventListener('input', function (e) {
                let cardNumber = e.target.value.replace(/[^\d]/g, '');
                cardNumber = cardNumber.substring(0, 16);

                let formattedCardNumber = '';
                for (let i = 0; i < cardNumber.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        formattedCardNumber += ' ';
                    }
                    formattedCardNumber += cardNumber.charAt(i);
                }

                e.target.value = formattedCardNumber.trim();
            });
        }
    },
    cardExp: {
        mounted(el) {
            el.value = formatValue(el.value);

            el.addEventListener('input', function (e) {
                let input = e.target.value.replace(/\D/g, '');
                input = formatValue(input);
                e.target.value = input;
            });
        },
        updated(el) {
            if (el.value && !/^(\d{2} \/ \d{2})$/.test(el.value)) {
                el.value = formatValue(el.value);
            }
        }
    },
    cardCCV: {
        mounted(el) {
            el.value = formatValue(el.value);

            el.addEventListener('input', function (e) {
                let input = e.target.value.replace(/\D/g, '');
                input = input.slice(0, 3);
                e.target.value = input;
            });
        },
        updated(el) {
            if (el.value && !/^\d{3}$/.test(el.value)) {
                el.value = formatValue2(el.value);
            }
        }
    }
}