# PPPL-JS
| **No.** |                            **Definition**                            | **Description**                                                                                                                                                                                           |
|:-------:|:--------------------------------------------------------------------:|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    1    | ```Nrand(seed)```                                                    | Seedable pseudorandom number generator.                                                                                                                                                                   |
|    2    | ```Srand(options, random_function = Math.random)```                  | Stock-style random option picker. Example options: See <sup>[1]</sup>.                                                                                                                                    |
|    3    | ```Rrand(ranges, random_function = Math.random)```                   | Range-style random number picker. Example ranges: See <sup>[2]</sup>.                                                                                                                                     |
| 4       | ```Arand(array, random_function = Math.random)```                    | Select random element from array.                                                                                                                                                                         |
| 5       | ```XDate(timestamp)```                                               | Select random element from array.                                                                                                                                                                         |
| 6       | ```ADOM(array, document)```                                          | Convert from ruled-array format to DOM format. Array format: See <sup>[3]</sup>.                                                                                                                          |
| 7       | ```fADOM(form_unique_id, items, include_label, custom_item_types)``` | Extended PPPL_JS.ADOM for form.<br/> Item format: See <sup>[4]</sup>.<br/> Item data format:  [See here](https://github.com/phonghng/phonghng.github.io/blob/main/scripts/PPPL-JS.js#L241). |
| 8       | ```PPPL_WUIC.popup.open(container_element, title, close_callback)``` | Open PPPL-WUIC popup.                                                                                                                                                                                     |
| 9       | ```PPPL_WUIC.popup.open(container_element, close_callback)```        | Close PPPL-WUIC popup.                                                                                                                                                                                    |
| 10      | ```JSEncrypt.generate_keys(private_key)```                           | Generate keys for JSEncrypt.                                                                                                                                                                              |
| 11      | ```JSEncrypt.encrypt(public_key, message)```                         | Encrypt using JSEncrypt.                                                                                                                                                                                  |
| 12      | ```JSEncrypt.decrypt(private_key, encrypted)```                      | Decrypt using JSEncrypt.                                                                                                                                                                                  |

<sup>[1]</sup> Example options: ```[[0.25, "Option A with 25% chance"], [0.75, "Option B with 75% chance"]]```.<br/>
<sup>[2]</sup> Example ranges: ```[[1, 10], [15, 25]]```.<br/>
<sup>[3]</sup> Array format:</br>
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
<sup>[4]</sup> Item format: ```[item_type, item_id, item_title, item_data]```.

# PPPL-CSS
## Popup
```
<div PPPL-WUIC="popup" class="container">
    <div class="main">
        <div class="title"></div>
        <div class="close_button"></div>
        <div class="content"></div>
    </div>
</div>
```