# PPPL-JS
| **STT** | **Định nghĩa** | **Mô tả** |
|:---:|:---:|---|
| 1 | ```Nrand(seed)``` | Sinh số ngẫu nhiên có "seed". |
| 2 | ```Srand(options, random_function = Math.random)``` | Chọn phần tử ngẫu nhiên theo "phong cách chứng khoán". Định dạng ```options```, xem <sup>[1]</sup>. |
| 3 | ```Rrand(ranges, random_function = Math.random)``` | Chọn số ngẫu nhiên trong khoảng. Định dạng ```options```, xem <sup>[2]</sup>. |
| 4 | ```Arand(array, random_function = Math.random)``` | Chọn phần tử ngẫu nhiên trong mảng. |
| 5 | ```XDate(timestamp)``` | Các thông tin mở rộng về ngày tháng. |
| 6 | ```ADOM(array, document)``` | Tạo DOM từ mảng thông tin đặc biệt. Định dạng ```array```, xem <sup>[3]</sup>. |
| 7 | ```fADOM(form_unique_id, items, include_label, custom_item_types)``` | PPPL-JS.ADOM chuyên dụng cho biểu mẫu.<br>Định dạng ```items```, xem <sup>[4]</sup>.<br>Định dạng ```item_data```, xem [tại đây](https://github.com/phonghng/phonghng.github.io/blob/main/scripts/PPPL-JS.js#L241). |
| 8 | ```PPPL_WUIC.popup.open(container_element, title, close_callback)``` | Mở pop-up PPPL-WUIC. |
| 9 | ```PPPL_WUIC.popup.open(container_element, close_callback)``` | Đóng PPPL-WUIC pop-up. |
| 8 | ```PPPL_WUIC.tab.init(container_element)``` | Khởi tạo tab PPPL-WUIC. |
| 9 | ```PPPL_WUIC.tab.open_tab(container_element, navagator_buttons, tab_contents, event)``` | Mở tab PPPL-WUIC (theo sự kiện của nút). |

<sup>[1]</sup> Định dạng ```options```: ```[[0.25, "Option A with 25% chance"], [0.75, "Option B with 75% chance"]]```.<br/>
<sup>[2]</sup> Định dạng ```ranges```: ```[[1, 10], [15, 25]]```.<br/>
<sup>[3]</sup> Định dạng ```array```:</br>
```
[
    tag_name,
    {
        "html_attributes_key": "value"
    },
    {
        "javascript_attributes_key": "value"
    },
    children_as_ADOM_or_element,
    callback
]
```
<sup>[4]</sup> Định dạng ```items```: ```[item_type, item_id, item_title, item_data]```.

# PPPL-CSS
## Cài đặt khuyến nghị
```
button,
input:not([type="checkbox"]),
select,
textarea {
    --base_color: var(--GREY_1);
}

button {
    --base_color: var(--GREY_1);
}

[PPPL-WUIC="popup"] {
    --outside_background_color: var(--GREY_4);
    --inside_background_color: var(--GREY_3);
}

[PPPL-WUIC="tab"] {
    --base_color: var(--GREY_1);
}
```

# PPPL-WUIC
## Popup
```
<div PPPL-WUIC="popup">
    <div class="main">
        <div class="title"></div>
        <div class="close_button"></div>
        <div class="content"></div>
    </div>
</div>
```
## Tab
```
<div PPPL-WUIC="tab">
<div class="navigator">
    <button class="active" name=""></button>
    <button name=""></button>
</div>
<div class="content">
    <div class="tab_content active" name=""></div>
    <div class="tab_content" name=""></div>
</div>
</div>
```