package com.tsolution.utils.jxls.commands;

import javax.xml.namespace.QName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.jxls.area.Area;
import org.jxls.command.AbstractCommand;
import org.jxls.command.Command;
import org.jxls.common.CellRef;
import org.jxls.common.Context;
import org.jxls.common.Size;
import org.jxls.transform.poi.PoiTransformer;
import org.openxmlformats.schemas.spreadsheetml.x2006.main.impl.CTRowImpl;

public class AutoRowHeightCommand extends AbstractCommand {

	private static final Logger log = LogManager.getLogger(AutoRowHeightCommand.class);

	private Area area;

	@Override
	public String getName() {
		return "autoRowHeight";
	}

	@Override
	public Command addArea(Area area) {
		super.addArea(area);
		this.area = area;
		return this;
	}

	@Override
	public Size applyAt(CellRef cellRef, Context context) {
		Size size = this.area.applyAt(cellRef, context);

		PoiTransformer transformer = (PoiTransformer) this.area.getTransformer();
		Workbook workbook = transformer.getWorkbook();
		Row row = workbook.getSheet(cellRef.getSheetName()).getRow(cellRef.getRow());
		if (row == null) {
			return size;
		}
		row.setHeight((short) -1);
		this.removeDyDescentAttr(row);
		return size;
	}

	private void removeDyDescentAttr(Row row) {
		if (row instanceof XSSFRow) {
			XSSFRow xssfRow = (XSSFRow) row;
			CTRowImpl ctRow = (CTRowImpl) xssfRow.getCTRow();
			QName dyDescent = new QName("http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac");
			if (ctRow.get_store().find_attribute_user(dyDescent) != null) {
				ctRow.get_store().remove_attribute(dyDescent);
			}
		} else {
			AutoRowHeightCommand.log.error("This method applicable only for xlsx-templates");
		}
	}
}
