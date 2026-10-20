const productsUtil = require('../../utils/products.js');

// 商品图片高度随机生成（模拟瀑布流）
const IMG_HEIGHTS = [280, 320, 360, 400, 340, 300];

Page({
  data: {
    searchKey: '',
    banners: [
      { title: '红色文化 · 匠心之作', desc: '精选文创好物 限时特惠', bg: 'linear-gradient(135deg, #c41e3a 0%, #e54545 50%, #ff8a80 100%)' },
      { title: '新品尝鲜价', desc: '全场满99减20', bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #c41e3a 100%)' },
      { title: '限时包邮到家', desc: '优质好物 安心选购', bg: 'linear-gradient(135deg, #e54545 0%, #c41e3a 50%, #8e0000 100%)' }
    ],
    categoryIcons: [
      { name: '全部', icon: '/images/icons/home.svg', bg: '#fff5f5' },
      { name: '配件', icon: '/images/icons/bag.svg', bg: '#fff0e6' },
      { name: '纪念品', icon: '/images/icons/medal.svg', bg: '#fffbe6' },
      { name: '文具', icon: '/images/icons/note.svg', bg: '#e6f7ff' },
      { name: '服饰', icon: '/images/icons/tshirt.svg', bg: '#f0f5ff' },
      { name: '生活用品', icon: '/images/icons/coffee.svg', bg: '#f6ffed' },
      { name: '热门', icon: '/images/icons/fire.svg', bg: '#fff1f0' },
      { name: '推荐', icon: '/images/icons/diamond2.svg', bg: '#fff9e6' }
    ],
    famousFigures: [
      { name: '\u5eb7\u6709\u4e3a', title: '\u53d8\u6cd5\u5148\u9a71', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDwhLS0g5bq35pyJ5Li6IC0g5Y+Y5rOV5YWI6amx77yM5Lmm5Y235rCUIC0tPg0KICA8ZGVmcz4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOEI0NTEzIi8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNEMjY5MUUiLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjU2IiBmaWxsPSJ1cmwoI2JnMSkiLz4NCiAgPCEtLSDlpLTpg6ggLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iMzgiIHI9IjE4IiBmaWxsPSIjRkRFQkQwIi8+DQogIDwhLS0g5Y+R6au777yI5riF5Luj5paH5Lq65b2i6LGh77yJIC0tPg0KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSIyMiIgcng9IjEyIiByeT0iOCIgZmlsbD0iIzMzMyIvPg0KICA8IS0tIOi6q+S9ky/plb/ooo0gLS0+DQogIDxwYXRoIGQ9Ik0zNiA1NiBRMzYgNTIgNDIgNTAgTDU0IDQ2IFE2MCA0NCA2NiA0NiBMNzggNTAgUTg0IDUyIDg0IDU2IEw4MiAxMDAgUTYwIDEwNSAzOCAxMDAgWiIgZmlsbD0iIzJDM0U1MCIvPg0KICA8IS0tIOmihuWPoyAtLT4NCiAgPHBhdGggZD0iTTUyIDUwIEw2MCA2MiBMNjggNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Y1RjVEQyIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDwhLS0g5Lmm5Y23IC0tPg0KICA8cmVjdCB4PSI3MiIgeT0iNTgiIHdpZHRoPSIxOCIgaGVpZ2h0PSIyNCIgcng9IjIiIGZpbGw9IiNGNUY1REMiIHN0cm9rZT0iIzhCNDUxMyIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4NCiAgPGxpbmUgeDE9Ijc2IiB5MT0iNjQiIHgyPSI4NiIgeTI9IjY0IiBzdHJva2U9IiM4QjQ1MTMiIHN0cm9rZS13aWR0aD0iMSIvPg0KICA8bGluZSB4MT0iNzYiIHkxPSI2OCIgeDI9Ijg2IiB5Mj0iNjgiIHN0cm9rZT0iIzhCNDUxMyIgc3Ryb2tlLXdpZHRoPSIxIi8+DQogIDxsaW5lIHgxPSI3NiIgeTE9IjcyIiB4Mj0iODYiIHkyPSI3MiIgc3Ryb2tlPSIjOEI0NTEzIiBzdHJva2Utd2lkdGg9IjEiLz4NCiAgPCEtLSDnnLznnZsgLS0+DQogIDxjaXJjbGUgY3g9IjUzIiBjeT0iMzYiIHI9IjIiIGZpbGw9IiMzMzMiLz4NCiAgPGNpcmNsZSBjeD0iNjciIGN5PSIzNiIgcj0iMiIgZmlsbD0iIzMzMyIvPg0KICA8IS0tIOiDoemhuyAtLT4NCiAgPHBhdGggZD0iTTU2IDQ2IFE2MCA1MiA2NCA0NiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiLz4NCjwvc3ZnPg==', bg: '#FFF8E1', border: '#D2691E', desc: '\u620a\u620c\u53d8\u6cd5\u9886\u8896' },
      { name: '\u53f6\u95ee', title: '\u548f\u6625\u5b97\u5e08', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDwhLS0g5Y+26ZeuIC0g5ZKP5pil5a6X5biI77yM5q2m5pyv5ae/5oCBIC0tPg0KICA8ZGVmcz4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWExYTJlIi8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxNjIxM2UiLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjU2IiBmaWxsPSJ1cmwoI2JnMikiLz4NCiAgPCEtLSDlpLTpg6ggLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iMzIiIHI9IjE2IiBmaWxsPSIjRkRFQkQwIi8+DQogIDwhLS0g5aS05Y+RIC0tPg0KICA8cGF0aCBkPSJNNDQgMjggUTQ4IDE2IDYwIDE0IFE3MiAxNiA3NiAyOCBRNzQgMjIgNjAgMjAgUTQ2IDIyIDQ0IDI4WiIgZmlsbD0iIzMzMyIvPg0KICA8IS0tIOi6q+S9ky/llJDoo4UgLS0+DQogIDxwYXRoIGQ9Ik00MCA0OCBRNDAgNDQgNDYgNDIgTDU0IDQwIFE2MCAzOCA2NiA0MCBMNzQgNDIgUTgwIDQ0IDgwIDQ4IEw3OCAxMDAgUTYwIDEwNSA0MiAxMDAgWiIgZmlsbD0iI0MwMzkyQiIvPg0KICA8IS0tIOWUkOijheeri+mihiAtLT4NCiAgPHBhdGggZD0iTTUyIDQyIEw1NiA1MiBMNjAgNDggTDY0IDUyIEw2OCA0MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRjVGNURDIiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPCEtLSDnm5jmiaMgLS0+DQogIDxjaXJjbGUgY3g9IjU4IiBjeT0iNTYiIHI9IjIiIGZpbGw9IiNGNUY1REMiLz4NCiAgPGNpcmNsZSBjeD0iNjIiIGN5PSI2MiIgcj0iMiIgZmlsbD0iI0Y1RjVEQyIvPg0KICA8IS0tIOWSj+aYpeaJi+WKvyAtLT4NCiAgPHBhdGggZD0iTTQwIDYwIEwyNCA1MiBRMjAgNTAgMTggNTIgTDE0IDU2IiBmaWxsPSJub25lIiBzdHJva2U9IiNGREVCRDAiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQogIDwhLS0g55y8552bIC0tPg0KICA8ZWxsaXBzZSBjeD0iNTQiIGN5PSIzMCIgcng9IjIiIHJ5PSIyLjUiIGZpbGw9IiMzMzMiLz4NCiAgPGVsbGlwc2UgY3g9IjY2IiBjeT0iMzAiIHJ4PSIyIiByeT0iMi41IiBmaWxsPSIjMzMzIi8+DQogIDwhLS0g5rCU5Zy657q/5p2hIC0tPg0KICA8cGF0aCBkPSJNMjAgNzAgUTMwIDY2IDQwIDcyIiBmaWxsPSJub25lIiBzdHJva2U9IiNFNzRDM0MiIHN0cm9rZS13aWR0aD0iMS41IiBvcGFjaXR5PSIwLjYiLz4NCiAgPHBhdGggZD0iTTE2IDc4IFEyOCA3NCA0MiA4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRTc0QzNDIiBzdHJva2Utd2lkdGg9IjEuNSIgb3BhY2l0eT0iMC40Ii8+DQo8L3N2Zz4=', bg: '#FCE4EC', border: '#C0392B', desc: '\u4e00\u4ee3\u6b66\u672f\u5b97\u5e08' },
      { name: '\u8a79\u5929\u4f51', title: '\u94c1\u8def\u4e4b\u7236', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDwhLS0g6Km55aSp5L2RIC0g6ZOB6Lev5LmL54i277yM54Gr6L2mL+mTgei3ryAtLT4NCiAgPGRlZnM+DQogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZzMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJDM0U1MCIvPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzQ0OTVFIi8+DQogICAgPC9saW5lYXJHcmFkaWVudD4NCiAgPC9kZWZzPg0KICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI1NiIgZmlsbD0idXJsKCNiZzMpIi8+DQogIDwhLS0g6ZOB6L2oIC0tPg0KICA8cGF0aCBkPSJNMTAgODIgTDYwIDYyIEwxMTAgODIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0JEQzNDNyIgc3Ryb2tlLXdpZHRoPSIzIi8+DQogIDxwYXRoIGQ9Ik0xMCA4OCBMNjAgNjggTDExMCA4OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQkRDM0M3IiBzdHJva2Utd2lkdGg9IjMiLz4NCiAgPCEtLSDmnpXmnKggLS0+DQogIDxsaW5lIHgxPSIyMCIgeTE9IjgzIiB4Mj0iMjAiIHkyPSI4OSIgc3Ryb2tlPSIjQkRDM0M3IiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPGxpbmUgeDE9IjM1IiB5MT0iNzciIHgyPSIzNSIgeTI9IjgzIiBzdHJva2U9IiNCREMzQzciIHN0cm9rZS13aWR0aD0iMiIvPg0KICA8bGluZSB4MT0iNTAiIHkxPSI3MSIgeDI9IjUwIiB5Mj0iNzciIHN0cm9rZT0iI0JEQzNDNyIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDxsaW5lIHgxPSI3MCIgeTE9IjcxIiB4Mj0iNzAiIHkyPSI3NyIgc3Ryb2tlPSIjQkRDM0M3IiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPGxpbmUgeDE9Ijg1IiB5MT0iNzciIHgyPSI4NSIgeTI9IjgzIiBzdHJva2U9IiNCREMzQzciIHN0cm9rZS13aWR0aD0iMiIvPg0KICA8bGluZSB4MT0iMTAwIiB5MT0iODMiIHgyPSIxMDAiIHkyPSI4OSIgc3Ryb2tlPSIjQkRDM0M3IiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgPCEtLSDkurrlvaIgLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjE0IiBmaWxsPSIjRkRFQkQwIi8+DQogIDwhLS0g5bi95a2Q77yI5bel56iL5biI5bi977yJIC0tPg0KICA8cGF0aCBkPSJNNDQgMjggUTQ0IDE2IDYwIDE0IFE3NiAxNiA3NiAyOCBMNzQgMjggUTc0IDIwIDYwIDE4IFE0NiAyMCA0NiAyOFoiIGZpbGw9IiNGMzlDMTIiLz4NCiAgPHJlY3QgeD0iNDIiIHk9IjI2IiB3aWR0aD0iMzYiIGhlaWdodD0iNCIgcng9IjIiIGZpbGw9IiNFNjdFMjIiLz4NCiAgPCEtLSDouqvkvZMgLS0+DQogIDxwYXRoIGQ9Ik00MiA0NCBRNDIgNDAgNDggMzggTDU0IDM2IFE2MCAzNCA2NiAzNiBMNzIgMzggUTc4IDQwIDc4IDQ0IEw3NiA2MiBRNjAgNjYgNDQgNjIgWiIgZmlsbD0iIzI5ODBCOSIvPg0KICA8IS0tIOaMh+WQkei/nOaWueeahOaJiyAtLT4NCiAgPHBhdGggZD0iTTc4IDQ4IEw5NiA0MCIgc3Ryb2tlPSIjRkRFQkQwIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KICA8IS0tIOecvOedmyAtLT4NCiAgPGNpcmNsZSBjeD0iNTUiIGN5PSIyOCIgcj0iMiIgZmlsbD0iIzMzMyIvPg0KICA8Y2lyY2xlIGN4PSI2NSIgY3k9IjI4IiByPSIyIiBmaWxsPSIjMzMzIi8+DQo8L3N2Zz4=', bg: '#E3F2FD', border: '#2980B9', desc: '\u4e2d\u56fd\u94c1\u8def\u4e4b\u7236' },
      { name: '\u674e\u5c0f\u9f99', title: '\u529f\u592b\u4f20\u5947', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDwhLS0g5p2O5bCP6b6ZIC0g5q2m5pyv5Lyg5aWH77yM5oiq5ouz6YGT5ae/5oCBIC0tPg0KICA8ZGVmcz4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnNCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZENzAwIi8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjhDMDAiLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjU2IiBmaWxsPSJ1cmwoI2JnNCkiLz4NCiAgPCEtLSDouqvkvZMv5Yqf5aSr5LiK6KGjIC0tPg0KICA8cGF0aCBkPSJNNDIgNDggUTQyIDQ0IDQ4IDQyIEw1NCA0MCBRNjAgMzggNjYgNDAgTDcyIDQyIFE3OCA0NCA3OCA0OCBMNzYgOTAgUTYwIDk0IDQ0IDkwIFoiIGZpbGw9IiMxMTEiLz4NCiAgPCEtLSDogozogonnur/mnaEgLS0+DQogIDxwYXRoIGQ9Ik01MiA1MiBMNjAgNjAgTDY4IDUyIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMS41IiBvcGFjaXR5PSIwLjUiLz4NCiAgPCEtLSDlpLTpg6ggLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjE2IiBmaWxsPSIjRDRBNTc0Ii8+DQogIDwhLS0g57uP5YW45Y+R5Z6LIC0tPg0KICA8cGF0aCBkPSJNNDQgMjYgUTQ0IDEyIDYwIDEwIFE3NiAxMiA3NiAyNiBRNzQgMTggNjAgMTYgUTQ2IDE4IDQ0IDI2WiIgZmlsbD0iIzExMSIvPg0KICA8IS0tIOagh+W/l+aAp+S+p+i4ouWnv+WKvyAtIOiFvyAtLT4NCiAgPHBhdGggZD0iTTQ4IDkwIEw0NCA5NiIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KICA8cGF0aCBkPSJNNzIgNzggTDk2IDU4IiBzdHJva2U9IiMxMTEiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQogIDwhLS0g5oiq5ouz6YGT5omL5Yq/IC0tPg0KICA8cGF0aCBkPSJNNDIgNTYgTDE4IDQ0IiBzdHJva2U9IiNENEE1NzQiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQogIDxwYXRoIGQ9Ik03OCA1MiBMOTIgNDQiIHN0cm9rZT0iI0Q0QTU3NCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4NCiAgPCEtLSDnnLznnZsgLSDlh4zljonnm67lhYkgLS0+DQogIDxwYXRoIGQ9Ik01MiAyOCBMNTggMjYiIHN0cm9rZT0iIzExMSIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDxwYXRoIGQ9Ik02MiAyNiBMNjggMjgiIHN0cm9rZT0iIzExMSIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogIDxjaXJjbGUgY3g9IjU1IiBjeT0iMjgiIHI9IjEuNSIgZmlsbD0iIzExMSIvPg0KICA8Y2lyY2xlIGN4PSI2NSIgY3k9IjI4IiByPSIxLjUiIGZpbGw9IiMxMTEiLz4NCiAgPCEtLSDpvpnnurnoo4XppbAgLS0+DQogIDxwYXRoIGQ9Ik0xNCAxMDAgUTMwIDkwIDQ2IDEwMCBRNjAgMTA4IDc2IDEwMCBROTIgOTIgMTA4IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY0NTAwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNyIvPg0KPC9zdmc+', bg: '#FFFDE7', border: '#FF8C00', desc: '\u622a\u62f3\u9053\u521b\u59cb\u4eba' }
    ],
    countdown: { h: '02', m: '30', s: '00' },
    flashProducts: [],
    products: [],
    filteredProducts: [],
    leftProducts: [],
    rightProducts: [],
    activeTab: 'all',
    priceOrder: 'desc',
    currentCategory: '全部',
    loading: false,
    noMore: true,
    showBackTop: false,
    cartCount: 0
  },

  countdownTimer: null,

  onLoad: function () {
    this.initData();
    this.startCountdown();
  },

  onShow: function () {
    this.loadCartCount();
  },

  onUnload: function () {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },

  onPageScroll: function (e) {
    this.setData({
      showBackTop: e.scrollTop > 600
    });
  },

  initData: function () {
    var that = this;
    var products = productsUtil.getAllProducts();

    // 先将 cloud:// 链接转为 HTTPS CDN 链接，再渲染
    productsUtil.resolveCDNUrls(products).then(function(cdnProducts) {
      var enhanced = cdnProducts.map(function(p, i) {
        return Object.assign({}, p, {
          isHot: p.sales > 1000,
          originalPrice: (p.price * (1.2 + Math.random() * 0.3)).toFixed(2),
          brand: '佛山文创',
          comments: Math.floor(Math.random() * 200) + 20,
          imgHeight: IMG_HEIGHTS[i % IMG_HEIGHTS.length]
        });
      });

      var flashProducts = enhanced.slice()
        .sort(function(a, b) { return b.sales - a.sales; })
        .slice(0, 4)
        .map(function(p) { return Object.assign({}, p, { price: (p.price * 0.7).toFixed(2) }); });

      that.setData({
        products: enhanced,
        flashProducts: flashProducts
      });

      that.filterAndSplit();
    }).catch(function(err) {
      console.error('CDN转换失败:', err);
      // 降级：使用原始链接
      var enhanced = products.map(function(p, i) {
        return Object.assign({}, p, {
          isHot: p.sales > 1000,
          originalPrice: (p.price * (1.2 + Math.random() * 0.3)).toFixed(2),
          brand: '佛山文创',
          comments: Math.floor(Math.random() * 200) + 20,
          imgHeight: IMG_HEIGHTS[i % IMG_HEIGHTS.length]
        });
      });
      var flashProducts = enhanced.slice()
        .sort(function(a, b) { return b.sales - a.sales; })
        .slice(0, 4)
        .map(function(p) { return Object.assign({}, p, { price: (p.price * 0.7).toFixed(2) }); });
      that.setData({
        products: enhanced,
        flashProducts: flashProducts
      });
      that.filterAndSplit();
    });
  },

  startCountdown: function () {
    // 设置2.5小时后的倒计时
    let totalSeconds = 2 * 3600 + 30 * 60;
    this.countdownTimer = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) totalSeconds = 7200;
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(totalSeconds % 60).padStart(2, '0');
      this.setData({ countdown: { h, m, s } });
    }, 1000);
  },

  // 搜索相关
  onSearchInput: function (e) {
    this.setData({ searchKey: e.detail.value });
  },

  clearSearch: function () {
    this.setData({ searchKey: '' });
    this.filterAndSplit();
  },

  doSearch: function () {
    this.filterAndSplit();
  },

  onSearch: function () {
    this.filterAndSplit();
  },

  // 分类切换
  switchCategory: function (e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
      activeTab: 'all',
      searchKey: ''
    });
    this.filterAndSplit();
  },

  // 标签切换
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    let priceOrder = this.data.priceOrder;

    if (tab === 'price') {
      priceOrder = priceOrder === 'desc' ? 'asc' : 'desc';
    }

    this.setData({ activeTab: tab, priceOrder });
    this.filterAndSplit();
  },

  // 筛选、排序、瀑布流拆分
  filterAndSplit: function () {
    var list = this.data.products.slice();

    // 分类筛选
    if (this.data.currentCategory !== '全部') {
      list = list.filter(p => p.category === this.data.currentCategory);
    }

    // 搜索过滤
    if (this.data.searchKey.trim()) {
      const key = this.data.searchKey.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(key) ||
        p.category.toLowerCase().includes(key) ||
        p.description.toLowerCase().includes(key)
      );
    }

    // 排序
    const tab = this.data.activeTab;
    if (tab === 'sales') {
      list.sort((a, b) => b.sales - a.sales);
    } else if (tab === 'new') {
      list.sort((a, b) => b.id - a.id);
    } else if (tab === 'price') {
      list.sort((a, b) => this.data.priceOrder === 'asc' ? a.price - b.price : b.price - a.price);
    }

    this.setData({
      filteredProducts: list,
      noMore: true
    });

    // 瀑布流拆分
    this.splitWaterfall(list);
  },

  splitWaterfall: function (list) {
    const left = [];
    const right = [];
    list.forEach((item, i) => {
      if (i % 2 === 0) {
        left.push(item);
      } else {
        right.push(item);
      }
    });
    this.setData({
      leftProducts: left,
      rightProducts: right
    });
  },

  // 图片加载完成
  onImgLoad: function (e) {
    const id = e.currentTarget.dataset.id;
    const width = 345; // 大约一列的rpx宽度
    const ratio = e.detail.height / e.detail.width;
    const height = Math.round(width * ratio);

    var updateLeft = this.data.leftProducts.map(function(p) {
      return p.id === id ? Object.assign({}, p, { imgHeight: height }) : p;
    });
    var updateRight = this.data.rightProducts.map(function(p) {
      return p.id === id ? Object.assign({}, p, { imgHeight: height }) : p;
    });

    this.setData({
      leftProducts: updateLeft,
      rightProducts: updateRight
    });
  },

  // 购物车
  loadCartCount: function () {
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ cartCount: cart.length });
  },

  addToCart: function (e) {
    const productId = e.currentTarget.dataset.id;
    const product = productsUtil.getProductById(productId);

    const cart = wx.getStorageSync('cart') || [];
    const idx = cart.findIndex(item => item.id === productId);

    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push(Object.assign({}, product, { quantity: 1, addTime: Date.now() }));
    }

    wx.setStorageSync('cart', cart);
    this.setData({ cartCount: cart.length });

    wx.showToast({ title: '已加入购物车', icon: 'success', duration: 1500 });
  },

  goToCart: function () {
    wx.navigateTo({ url: '/pages/cart/cart' });
  },

  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/product-detail/product-detail?id=${id}` });
  },

  viewMore: function () {
    wx.showToast({ title: '更多秒杀即将开放', icon: 'none', duration: 1500 });
  },

  goTop: function () {
    wx.pageScrollTo({ scrollTop: 0, duration: 300 });
  },

  // 佛山伟人点击
  onFigureTap: function (e) {
    const name = e.currentTarget.dataset.name;
    const title = e.currentTarget.dataset.title;
    wx.showToast({ title: `${name}·${title}`, icon: 'none', duration: 2000 });
  }
});
