module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  overrides: [
    // {
    //   "files": ["**/*.tsx", "**/*.ts"],
    //   "customSyntax": "@stylelint/postcss-css-in-js",
    // },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less'
    },
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    }
  ],
  rules: {
    'at-rule-empty-line-before': null,
    // 指定声明块内属性的字母顺序
    'order/properties-order': [
      'display',
      'width',
      'height',
      'float',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'margin-collapse',
      'margin-top-collapse',
      'margin-right-collapse',
      'margin-bottom-collapse',
      'margin-left-collapse',
      'z-index',
      'overflow',
      'overflow-x',
      'overflow-y',
      'clip',
      'clear',
      'font',
      'font-family',
      'font-size',
      'font-smoothing',
      'osx-font-smoothing',
      'font-style',
      'font-weight',
      'hyphens',
      'src',
      'line-height',
      'letter-spacing',
      'word-spacing',
      'color',
      'text-align',
      'text-decoration',
      'text-indent',
      'text-overflow',
      'text-rendering',
      'text-size-adjust',
      'text-shadow',
      'text-transform',
      'word-break',
      'word-wrap',
      'white-space',
      'vertical-align',
      'list-style',
      'list-style-type',
      'list-style-position',
      'list-style-image',
      'pointer-events',
      'cursor',
      'background',
      'background-attachment',
      'background-color',
      'background-image',
      'background-position',
      'background-repeat',
      'background-size',
      'border',
      'border-collapse',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',
      'border-color',
      'border-image',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',
      'border-spacing',
      'border-style',
      'border-top-style',
      'border-right-style',
      'border-bottom-style',
      'border-left-style',
      'border-width',
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width',
      'border-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-top-left-radius',
      'border-radius-top-right',
      'border-radius-bottom-right',
      'border-radius-bottom-left',
      'border-radius-top-left',
      'content',
      'quotes',
      'outline',
      'outline-offset',
      'opacity',
      'filter',
      'visibility',
      'size',
      'zoom',
      'transform',
      'box-align',
      'box-flex',
      'box-orient',
      'box-pack',
      'box-shadow',
      'box-sizing',
      'table-layout',
      'animation',
      'animation-delay',
      'animation-duration',
      'animation-iteration-count',
      'animation-name',
      'animation-play-state',
      'animation-timing-function',
      'animation-fill-mode',
      'transition',
      'transition-delay',
      'transition-duration',
      'transition-property',
      'transition-timing-function',
      'background-clip',
      'backface-visibility',
      'resize',
      'appearance',
      'user-select',
      'interpolation-mode',
      'direction',
      'marks',
      'page',
      'set-link-source',
      'unicode-bidi',
      'speak'
    ],
    //  缩进 4 个空格
    indentation: 2,
    //  去掉小数点前面的 0
    'number-leading-zero': 'never',
    //  使用双引号
    'string-quotes': 'single',
    //  每个属性声明末尾都要加分号
    // "declaration-block-trailing-semicolon": "always",
    //  属性值 0 后面不加单位
    'length-zero-no-unit': true,
    //  对空行的处理
    //  第一条属性声明前不允许有空行
    'declaration-empty-line-before': [
      'never',
      { ignore: ['after-declaration'] }
    ],
    //  每个样式规则前后都有空行，除了第一条规则与规则前有注释
    'rule-empty-line-before': [
      'always',
      { except: ['after-single-line-comment', 'first-nested'] }
    ],
    //  在结尾 "}" 之前不允许有空行
    // "block-closing-brace-empty-line-before": ["never"],
    //  不允许超过一行的空行
    'max-empty-lines': 1,
    //  每行句末不允许有多余空格
    'no-eol-whitespace': true,
    //  文件末尾需要有一个空行
    'no-missing-end-of-source-newline': true,
    //  大小写处理
    'unit-case': 'lower',
    // "color-hex-case": "upper",
    'value-keyword-case': 'lower',
    'function-name-case': 'lower',
    'property-case': 'lower',
    // "at-rule-name-case": "lower",
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-element-case': 'lower',
    'selector-type-case': 'lower',
    'media-feature-name-case': 'lower',
    'selector-anb-no-unmatchable': null,
    //  对空格的处理
    //  "{" 前必须有空格
    // "block-opening-brace-space-before": "always",
    //  注释 "/*" 后和 "*/" 前必须有空格
    'comment-whitespace-inside': 'always',
    //  属性名 ":" 后必须有空格
    'declaration-colon-space-after': 'always',
    //  属性名 ":" 前不能有空格
    'declaration-colon-space-before': 'never',
    //  声明属性末尾 ";" 前不能有空格
    // "declaration-block-semicolon-space-before": "never",
    //  属性值中的 "," 后必须有空格
    'function-comma-space-after': 'always',
    //  选择器例如 ">、+、~" 前后必须要有空格
    'selector-combinator-space-before': 'always',
    'selector-combinator-space-after': 'always',
    //  分隔多个选择器之间的 "," 后必须有空格
    'selector-list-comma-space-after': 'always',
    //  分隔多个选择器之间的 "," 前不能有空格
    'selector-list-comma-space-before': 'never',
    //  子代选择器之间没有额外空格
    'selector-descendant-combinator-no-non-space': true,
    //  多个属性值之间的 "," 后必须有空格
    'value-list-comma-space-after': 'always',
    //  多个属性值之间的 "," 前不能有空格
    'value-list-comma-space-before': 'never',
    //  媒体查询中设置断点宽度里的 ":" 后必须有空格
    'media-feature-colon-space-after': 'always',
    //  媒体查询中设置断点宽度里的 ":" 前不能有空格
    'media-feature-colon-space-before': 'never',
    // 禁止声明块中的重复属性。
    'declaration-block-no-duplicate-properties': [
      true,
      { ignore: ['consecutive-duplicates'] }
    ]
  }
};
