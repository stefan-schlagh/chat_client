import $ from 'jquery';
/*
    benötigt:
        jQuery
        font-awesome

    Password-toggle
 */
export function extendJQuery(){
    $.fn.extend({
        pwToggle: function(){
            this.prepend($('<i>')
                .addClass("fas fa-eye-slash psw-toggle-icon")
                .css({
                    position: 'absolute',
                    right: '20px',
                    top: '11px',
                    color: '#666',
                    cursor: 'pointer',
                    width: '16px',
                    height: '16px'
                })
                .hover(function() {
                    $(this).css('color','#666');
                }, function() {
                    $(this).css('color','#000');
                }));
            this.css({
                position:"relative"
            });

            let icon = this.get(0).children[0];
            let input = this.get(0).children[1];

            icon.addEventListener("click",function(){
                if(input.type === "password"){
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                    input.type = "text";
                }else{
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                    input.type = "password";
                }
            });
        }
    });
}