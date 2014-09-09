function generalSpreadsheet($data) {
	var $x = '<?xml version="1.0"?>\
<?mso-application progid="Excel.Sheet"?>\
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\
 xmlns:o="urn:schemas-microsoft-com:office:office"\
 xmlns:x="urn:schemas-microsoft-com:office:excel"\
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\
 xmlns:html="http://www.w3.org/TR/REC-html40">\
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">\
    <Author>{author}</Author>\
    <LastAuthor>{author}</LastAuthor>\
    <Created>{createdtime}</Created>\
    <LastSaved>{createdtime}</LastSaved>\
    <Version>15.00</Version>\
  </DocumentProperties>\
  <OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office">\
    <AllowPNG/>\
  </OfficeDocumentSettings>\
  <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">\
    <WindowHeight>7755</WindowHeight>\
    <WindowWidth>20490</WindowWidth>\
    <WindowTopX>0</WindowTopX>\
    <WindowTopY>0</WindowTopY>\
    <ProtectStructure>False</ProtectStructure>\
    <ProtectWindows>False</ProtectWindows>\
  </ExcelWorkbook>\
  <Styles>\
    <Style ss:ID="Default" ss:Name="Normal">\
      <Alignment ss:Vertical="Bottom"/>\
      <Borders/>\
      <Font ss:Color="#000000"/>\
      <Interior/>\
      <NumberFormat/>\
      <Protection/>\
    </Style>\
    <Style ss:ID="stitle">\
      <Font ss:Color="#000000" ss:Bold="1"/>\
    </Style>\
  </Styles>\
  <Worksheet ss:Name="Sheet1">\
    <Table ss:ExpandedColumnCount="{expandedcolumncount}" ss:ExpandedRowCount="{expandedrowcount}" x:FullColumns="1"\
     x:FullRows="1" ss:DefaultRowHeight="15">{rows}</Table>\
    <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">\
      <PageSetup>\
        <Header x:Margin="0.3"/>\
        <Footer x:Margin="0.3"/>\
        <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>\
      </PageSetup>\
      <Unsynced/>\
      <Print>\
        <ValidPrinterInfo/>\
        <PaperSizeIndex>9</PaperSizeIndex>\
        <HorizontalResolution>600</HorizontalResolution>\
        <VerticalResolution>600</VerticalResolution>\
      </Print>\
      <Selected/>\
      <Panes>\
        <Pane>\
          <Number>3</Number>\
          <ActiveCol>1</ActiveCol>\
        </Pane>\
      </Panes>\
      <ProtectObjects>False</ProtectObjects>\
      <ProtectScenarios>False</ProtectScenarios>\
    </WorksheetOptions>\
  </Worksheet>\
</Workbook>';

	var $r = '';

	$r += '<Row ss:AutoFitHeight="0">';
	for ( var $i = 0; $i < $data.title.length; $i++) {
		$r += '<Cell ss:Index="' + ($i + 1) + '" ss:StyleID="stitle"><Data ss:Type="String">' + $data.title[$i] + '</Data></Cell>';
	}
	$r += '</Row>';

	for ( var $i = 0; $i < $data.rows.length; $i++) {
		$r += '<Row ss:Index="' + ($i + 2) + '" ss:AutoFitHeight="0">';
		for ( var $j = 0; $j < $data.title.length; $j++) {
			if (typeof ($data.rows[$i][$j]) != 'undefined') {
				var $v = $data.rows[$i][$j]+'';
				$v = $v.replace(/[&]/g, '&amp;');
				$v = $v.replace(/[<]/g, '&lt;');
				$v = $v.replace(/[>]/g, '&gt;');
				$v = $v.replace(/["]/g, '&quot;');
				$r += '<Cell ss:Index="' + ($j + 1) + '"><Data ss:Type="String">' + $v + '</Data></Cell>';
			}
		}
		$r += '</Row>';
	}

	$x = $x.replace(/\{author\}/g, 'Sharepoint.plus');
	$x = $x.replace(/\{createdtime\}/g, (new Date()).format('isoDateTime') + 'Z');
	$x = $x.replace('{expandedcolumncount}', $data.title.length);
	$x = $x.replace('{expandedrowcount}', $data.rows.length + 1);
	$x = $x.replace('{rows}', $r);

	return $x;
}