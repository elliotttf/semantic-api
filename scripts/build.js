'use strict';

const fs = require('fs');
const {markdown} = require('markdown');
const path = require('path');

const README = fs.readFileSync(path.resolve(__dirname, '../README.md'), 'UTF-8');
const output = `
<div style="padding-left: 5%;padding-right: 5%">${markdown.toHTML(README)}</div>
<a href="https://github.com/elliotttf/semantic-api"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/e7bbb0521b397edbd5fe43e7f760759336b5e05f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677265656e5f3030373230302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png"></a>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-93415702-1', 'auto');
  ga('send', 'pageview');

</script>
`;

fs.writeFileSync(
  path.resolve(__dirname, '../index.html'),
  output,
  'UTF-8'
);

