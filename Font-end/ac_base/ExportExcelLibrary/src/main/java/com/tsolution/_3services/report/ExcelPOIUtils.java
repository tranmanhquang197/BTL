package com.tsolution._3services.report;

import java.awt.Color;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.FontUnderline;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.Units;
import org.apache.poi.xssf.streaming.SXSSFDrawing;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFDataFormat;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFHyperlink;
import org.apache.poi.xssf.usermodel.extensions.XSSFCellBorder.BorderSide;

import com.tsolution._1entities.vo.ReportParameterVO;
import com.tsolution.utils.CodeGenerator;
import com.tsolution.utils.Utils;

//import com.viettel.core.common.utils.DateUtil;
//import com.viettel.core.common.utils.StringUtil;
//import com.viettel.core.entities.vo.coreRpt.ReportParameterVO;

/**
 * The Class ExcelProcessUtils.
 *
 * @author hunglm16
 * @since February 27, 2014
 * @description Library APACHE POI
 */
public class ExcelPOIUtils {
	// writable workbook *.xlsx
	public final static String HEADER = "header";// in dam & can giua
	public final static String MENU = "menu";// nen mau xanh da troi, in dam, 4 duong vien dam
	public final static String MENU_GRAY = "menu_gray";// nen mau xam
	public final static String MENU_RED = "menu_red";// nen mau do
	public final static String MENU_BLUE = "menu_blue";// nen mau xanh nhat
	public final static String MENU_PINK = "menu_pink";// nen mau tim nhat
	public final static String BOLD = "bold";// in dam, can trai
	public final static String BOLD_LEFT = "bold_left";// in dam, can trai, khong vien
	public final static String BOLD_RIGHT = "bold_right";// in dam, can phai, khong vien
	public final static String BOLD_LEFT_PERCENT = "bold_left_percent";// in dam, can trai, kieu %
	public final static String BOLD_LEFT_NUMBER = "bold_left_number";// in dam, can trai, kieu int
	public final static String BOLD_CENTER = "bold_center";// in dam, can giua
	public final static String NORMAL_CENTER = "normal_center";// chu thuong, can giua, khong vien
	public final static String NORMAL_CENTER_LEFT = "normal_center_left";// chu thuong, can giua, khong vien
	public final static String NORMAL = "normal";// chu thuong, can trai, khong vien
	public final static String NORMAL_NUMBER = "normal";// so, can trai, khong vien
	public final static String NORMAL_NUMBER_RIGHT = "normal_number_right";// so, can phai, khong vien
	public final static String TIMES_TITLE = "times_title";// in dam, can giua
	public final static String TIMES_TITLE2 = "times_title";// in dam, can giua
	public final static String TITLE_VNM_BLACK = "title_vnm_black";// in dam, can giua, size chu 12 mau den, khong vien
	public final static String TITLE_NUTI_BLACK = "title_nuti_black";// in dam, can giua, size chu 20 mau den, khong
																		// vien
	public final static String TITLE_NUTI_BROWN = "title_nuti_brown";// in dam, can giua, size chu 20 mau nau, khong
																		// vien
	public final static String TITLE_NUTI_BROWN_LEFT = "title_nuti_brown_left";// in dam, can trai, size chu 20 mau nau,
																				// khong vien
	public final static String TITLE_VNM_BLACK_SALEMT = "title_vnm_black_salemt";// in dam, can giua, size chu 12 mau
																					// den, khong vien
	public final static String TITLE_BLUE = "title_blue";// in dam, can giua, size chu 12 mau xanh da troi, khong vien
	public final static String TIMES_BOLD_20 = "times_bold_20";// center, khong vien, font times new roman, size 20,
																// bold;
	public final static String TIMES_NORMAL_12 = "times_normal_12";// chu thuong, can trai, khong vien, font times new
																	// roman, size 12;
	public final static String TIMES_NORMAL_13 = "times_normal_13";// chu thuong, can trai, khong vien, font times new
																	// roman, size 13;
	public final static String TIMES_BOLD_13 = "times_bold_13";// chu thuong, can trai, khong vien, font times new
																// roman, size 13, bold;
	public final static String TIMES_BOLD_13_1 = "times_bold_13_1";// chu hoa, can trai, khong vien, font times new
																	// roman, size 13, bold;
	public final static String YELLOW_TIMES_NORMAL_12 = "yellow_times_normal_12";// chu thuong, can trai, khong vien,
																					// font times new roman, size 12,
																					// nen vang;
	public final static String YELLOW_TIMES_BOLD_12 = "yellow_times_bold_12";// chu thuong, can trai, khong vien, font
																				// times new roman, size 12, nen vang;
	public final static String DETAIL_ = "DETAIL_";
	public final static String MEDIUM_TOP_BORDER = "medium_top_border";
	public final static String MEDIUM_LEFT_BORDER = "medium_left_border";
	public final static String MEDIUM_RIGHT_BORDER = "medium_right_border";
	public final static String MEDIUM_BOTTOM_BORDER = "medium_bottom_border";

	public final static String HEADER_GREEN_TOP_BOTTOM_MEDIUM_WRAP_TEXT = "header_green_top_bottom_medium_wrap_text";// Vien
																														// Tren
																														// &
																														// Vien
																														// duoi
																														// boder
																														// dam,
																														// con
																														// lai
																														// la
																														// THIN
	// Header Nutifood
	public final static String HEADER_GREY_NONE_MEDIUM = "header_grey_none_medium";// Mau xam khong vien
	public final static String HEADER_BLUE_NONE_MEDIUM = "header_blue_none_medium";// Mau xanh vien thin
	public final static String HEADER_BLUE_2_NONE_MEDIUM = "header_blue_2_none_medium";// Mau xanh nhat vien thin
	// Header mac dinhg xanh da troi, in dam, chu mau trang
	public final static String HEADER_GRAY_TOP_BOTTOM_MEDIUM = "header_gray_top_bottom_medium";// Vien Tren & Vien duoi
																								// boder dam, con lai la
																								// THIN
	public final static String HEADER_BLUE_TOP_BOTTOM_MEDIUM = "header_blue_top_bottom_medium";// Vien Tren & Vien duoi
																								// boder dam, con lai la
																								// THIN
	public final static String HEADER_BLUE_TOP_RIGHT_MEDIUM = "header_blue_top_right_medium";// Vien tren & Vien phai
																								// dam
	public final static String HEADER_BLUE_ALL_THIN = "header_blue_all_thin";// 4 duong vien kieu THIN
	public final static String HEADER_BLUE_ALL_THIN_WRAP = "header_blue_all_thin_wrap";// 4 duong vien kieu THIN, Wrap
																						// text
	public final static String HEADER_BLUE_ALL_THIN_WRAP2 = "header_blue_all_thin_wrap2";// 4 duong vien kieu THIN, Wrap
																							// text, blue dam
	public final static String HEADER_BLUE_ALL_THIN_TOP_MEDIUM = "header_blue_all_thin_top_medium";// Vien tren dam, 3
																									// vien con lai THIN
	public final static String HEADER_BLUE_ALL_THIN_BOTTOM_MEDIUM = "header_blue_all_thin_bottom_medium";// Vien duoi
																											// dam, 3
																											// vien con
																											// lai THIN
	public final static String HEADER_BLUE_ALL_THIN_LEFT_MEDIUM = "header_blue_all_thin_left_medium";// Vien trai dam, 3
																										// vien con lai
																										// THIN
	public final static String HEADER_BLUE_ALL_MEDIUM_LEFT_THIN = "header_blue_all_medium_left_thin";// Tat ca vien dam,
																										// vien trai
																										// THIN
	public final static String HEADER_BLUE_ALL_THIN_RIGTH_MEDIUM = "header_blue_all_thin_right_medium";// Vien phai dam,
																										// tat cả con
																										// lai THIN
	public final static String HEADER_BLUE_R_L_THIN_TOP_MEDIUM = "header_blue_r_l_thin_top_medium";
	public final static String HEADER_BLUE_R_L_THIN_BOTTOM_MEDIUM = "header_blue_r_l_thin_bottom_medium";
	public final static String HEADER_BLUE_R_L_NONE_TOP_MEDIUM = "header_blue_r_l_none_top_medium";
	// Header mac dinh xanh la cay, in dam, chu trang
	public final static String HEADER_GREEN_ALL_THIN = "header_green_all_thin";// 4 duong vien kieu THIN
	// Header mac dinh xanh la cay, chu den
	public final static String HEADER_GREEN_ALL_THIN_BOLD = "header_green_all_thin_bold";// 4 duong vien kieu THIN
	// Header mac dinh xanh (cot dong), in dam, chu mau trang
	public final static String HEADER_GREEN_ALl_THIN_WRAPTEXT = "header_green_all_thin_wraptext";// font
																									// time_new_roman_12
	public final static String HEADER_YELLOW_ALl_THIN_WRAPTEXT_RED = "header_yellow_all_thin_wraptext_red";// font
																											// time_new_roman_12
	public final static String HEADER_RED_ALl_THIN_WRAPTEXT = "header_red_all_thin_wraptext";// font time_new_roman_12
	// Header mac dinhg xanh da nuoc bien (cot dong), in dam, chu mau trang
	public final static String HEADER_BLUESEA_ALL_THIN_TOP_MEDIUM = "header_bluesea_all_thin_top_medium";// Vien tren
																											// dam, tat
																											// ca THIN
	public final static String HEADER_BLUESEA_ALL_THIN_BOTTOM_MEDIUM = "header_bluesea_all_thin_bottom_medium";// Vien
																												// duoi
																												// dam,
																												// tat
																												// ca
																												// THIN
	public final static String ROW_DOTTED_LEFT_NUTI = "row_dotted_left_nuti";// can le trai, kieu text
	// Grid - Cell mac dinh: vien dotted(hair), nen trang, chu thuong size 9, arial
	public final static String ROW_DOTTED_CENTER = "row_dotted_center";// can le giua, kieu text
	public final static String ROW_DOTTED_CENTER_BO = "row_dotted_center_bo";// can le giua, kieu text, vien
	public final static String ROW_DOTTED_CENTER_BOLD = "row_dotted_center_bold";// can le giua, kieu text
	public final static String ROW_DOTTED_CENTER_RED = "row_dotted_center_red";// can le giua, chu do, kieu text
	public final static String ROW_DOTTED_LEFT = "row_dotted_left";// can le trai, kieu text
	public final static String ROW_DOTTED_LEFT_NOT_WRAP = "row_dotted_left_not_wrap";// can le trai, kieu text

	public final static String ROW_DOTTED_WRAP_LEFT = "row_dotted_wrap_left";// can le trai, kieu text, wrap
	public final static String ROW_DOTTED_LEFT_BOLD = "row_dotted_left_bold";// can le trai in dam, kieu text
	public final static String ROW_DOTTED_LEFT_BLUESKYLIGHT01 = "row_dotted_left_BlueSkyLight01";// background mau xanh
																									// duong nhat, can
																									// le trai
	public final static String ROW_DOTTED_RIGHT = "row_dotted_right";// can le phai, kieu so
	public final static String ROW_DOTTED_RIGHT_NOT_ZERO = "row_dotted_right_not_zero";// can le phai, kieu so, khong
																						// hien thi so 0
	public final static String ROW_DOTTED_RIGHT_FLOAT_TWO = "row_dotted_right_float_two";// can le phai, kieu so thuc
																							// lam tron 2 so
	public final static String ROW_DOTTED_RIGHT_FLOAT_BOLD_TWO = "row_dotted_right_float_bold_two";// can le phai, kieu
																									// so thuc lam tron
																									// 2 so in dam
	public final static String ROW_DOTTED_RIGHT_FLOAT = "row_dotted_right_float";// can le phai, kieu so thuc
	public final static String ROW_DOTTED_RIGHT_TEXT = "row_dotted_right_text";// can le phai kieu text
	public final static String ROW_DOTTED_RIGHT_BOLD = "row_dotted_right_bold";// can le phai in dam, kieu so
	public final static String ROW_DOTTED_RIGHT_RED = "row_dotted_right_red";// can phai chu do, kieu so
	public final static String ROW_DOTTED_RIGHT_PERCENT = "row_dotted_right_percent";// can le phai, kieu so %
	public final static String ROW_DOTTED_RIGHT_PERCENT_BOLD = "row_dotted_right_percent_bold";// can le phai, kieu so
																								// %, in dam
	public final static String ROW_DOTTED_RIGHT_FM_ZEZO = "row_dotted_right_fm_zezo";// can le phai, kieu so, cho phep
																						// hien thi so 0
	public final static String ROW_DOTTED_ACCOUNTING = "row_dotted_accounting";// fomat kieu accounting
	public final static String ROW_CENTER = "row_center";
	public final static String ROW_LEFT = "row_left";
	public final static String ROW_RIGHT = "row_right";
	public final static String ROW_RIGHT_FM_ZEZO = "row_right_fm_zezo";
	// Grid - Cell mac dinh: vien dotted(hair), nen cam (dam dan theo thu tu 01, 02,
	// 03, 04, 05), chu thuong size 9, arial, trai text, phai so (cho phep hien thi
	// so 0)
	// Can le trai
	public final static String ROW_DOTTED_LEFT_ORANGE01 = "row_dotted_left_orange_01";
	public final static String ROW_DOTTED_LEFT_ORANGE02 = "row_dotted_left_orange_02";
	public final static String ROW_DOTTED_LEFT_ORANGE03 = "row_dotted_left_orange_03";
	public final static String ROW_DOTTED_LEFT_ORANGE04 = "row_dotted_left_orange_04";
	public final static String ROW_DOTTED_LEFT_ORANGE05 = "row_dotted_left_orange_05";
	public final static String ROW_DOTTED_LEFT_ORANGE06 = "row_dotted_left_orange_06";
	// can le giua
	public final static String ROW_DOTTED_CENTER_ORANGE01 = "row_dotted_center_orange_01";
	public final static String ROW_DOTTED_CENTER_ORANGE02 = "row_dotted_center_orange_02";
	public final static String ROW_DOTTED_CENTER_ORANGE03 = "row_dotted_center_orange_03";
	public final static String ROW_DOTTED_CENTER_ORANGE04 = "row_dotted_center_orange_04";
	public final static String ROW_DOTTED_CENTER_ORANGE05 = "row_dotted_center_orange_05";
	public final static String ROW_DOTTED_CENTER_ORANGE06 = "row_dotted_center_orange_06";
	// can le phai
	public final static String ROW_DOTTED_RIGHT_ORANGE01 = "row_dotted_rigth_orange_01";
	public final static String ROW_DOTTED_RIGHT_ORANGE01_PERCENT = "row_dotted_rigth_orange_01_percent";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE01_RED = "row_dotted_right_orange_01_red";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE02 = "row_dotted_rigth_orange_02";
	public final static String ROW_DOTTED_RIGHT_ORANGE02_PERCENT = "row_dotted_right_orange_02_percent";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE02_RED = "row_dotted_right_orange_02_red";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE03 = "row_dotted_rigth_orange_03";
	public final static String ROW_DOTTED_RIGHT_ORANGE03_PERCENT = "row_dotted_right_orange_03_percent";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE03_RED = "row_dotted_right_orange_03_red";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE04 = "row_dotted_rigth_orange_04";
	public final static String ROW_DOTTED_RIGHT_ORANGE04_PERCENT = "row_dotted_right_orange_04_percent";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE04_RED = "row_dotted_right_orange_04_red";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE05 = "row_dotted_rigth_orange_05";
	public final static String ROW_DOTTED_RIGHT_ORANGE05_PERCENT = "row_dotted_right_orange_05_percent";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE05_RED = "row_dotted_right_orange_05_red";// kieu %
	public final static String ROW_DOTTED_RIGHT_ORANGE06 = "row_dotted_right_orange_06";
	public final static String ROW_DOTTED_RIGHT_ORANGE06_RED = "row_dotted_right_orange_06_red";
	// detail with red color font
	public final static String ROW_DOTTED_LEFT_ORANGE03_RED = "row_dotted_left_orange_03_red";
	public final static String ROW_DOTTED_CENTER_ORANGE01_RED = "row_dotted_center_orange_01_red";
	//

	// group color
	public final static String STYLE_TEXT_GROUP_LEVEL_1 = "style_text_group_level_1";
	public final static String STYLE_TEXT_GROUP_LEVEL_2 = "style_text_group_level_2";
	public final static String STYLE_TEXT_GROUP_LEVEL_3 = "style_text_group_level_3";
	public final static String STYLE_TEXT_GROUP_LEVEL_4 = "style_text_group_level_4";
	public final static String STYLE_TEXT_GROUP_LEVEL_5 = "style_text_group_level_5";

	public final static String STYLE_TEXT_NORMAL_GROUP_LEVEL_1 = "style_text_NORMAL_GROUP_level_1";
	public final static String STYLE_TEXT_NORMAL_GROUP_LEVEL_2 = "style_text_NORMAL_GROUP_level_2";
	public final static String STYLE_TEXT_NORMAL_GROUP_LEVEL_3 = "style_text_NORMAL_GROUP_level_3";
	public final static String STYLE_TEXT_NORMAL_GROUP_LEVEL_4 = "style_text_NORMAL_GROUP_level_4";
	public final static String STYLE_TEXT_NORMAL_GROUP_LEVEL_5 = "style_text_NORMAL_GROUP_level_5";

	// XSSF color
	public final static XSSFColor poiGrey = new XSSFColor(new Color(191, 191, 191));// Mau xam 01
	public final static XSSFColor poiBlue01 = new XSSFColor(new Color(49, 134, 155));// Mau xanh dam 01
	public final static XSSFColor poiBlue02 = new XSSFColor(new Color(91, 155, 213));// Mau xanh dam 02
	public final static XSSFColor poiBlue = new XSSFColor(new Color(83, 142, 213));// Mau xanh da troi dam 03
	public final static XSSFColor poiBlueSkyLight01 = new XSSFColor(new Color(221, 217, 196)); // Mau xanh da
																								// troi nhat
	public final static XSSFColor poiBlueSea = new XSSFColor(new Color(0, 176, 240)); // mau xanh nuoc bien
																						// (cot dong)
	/*
	 * public final static XSSFColor poiWhite = new XSSFColor(new
	 * java.awt.Color(255, 255, 255));//Mau trang public final static XSSFColor
	 * poiBlack = new XSSFColor(new java.awt.Color(0, 0, 0));//Mau den
	 */
	public final static XSSFColor poiWhite = new XSSFColor(Color.WHITE);// Mau trang
	public final static XSSFColor poiBlack = new XSSFColor(Color.BLACK);// Mau den
	public final static XSSFColor poiGreen = new XSSFColor(new Color(0, 176, 80));// mau xanh la cay
	public final static XSSFColor poiGreen02 = new XSSFColor(new Color(155, 187, 89));// mau xanh la cay 02
	public final static XSSFColor poiGreen03 = new XSSFColor(new Color(146, 208, 80));// mau xanh la cay 03
	public final static XSSFColor poiYearlow = new XSSFColor(new Color(252, 213, 180));// Mau den
	public final static XSSFColor poiYellow = new XSSFColor(new Color(255, 255, 153));
	public final static XSSFColor poiYellow2 = new XSSFColor(new Color(255, 255, 204));
	// Trong thang mau Cam 01...06 Mau dam dan
	public final static XSSFColor poiOrange01 = new XSSFColor(new Color(253, 233, 217));
	public final static XSSFColor poiOrange02 = new XSSFColor(new Color(252, 213, 180));
	public final static XSSFColor poiOrange03 = new XSSFColor(new Color(250, 191, 142));
	public final static XSSFColor poiOrange04 = new XSSFColor(new Color(247, 150, 70));
	public final static XSSFColor poiOrange05 = new XSSFColor(new Color(226, 107, 10));
	public final static XSSFColor poiOrange06 = new XSSFColor(new Color(151, 71, 6));
	public final static XSSFColor poiGray = new XSSFColor(new Color(216, 216, 216));
	public final static XSSFColor poiRed = new XSSFColor(new Color(255, 0, 0));
	public final static XSSFColor poiBrown = new XSSFColor(new Color(204, 102, 0));
	public final static XSSFColor poiBlue1 = new XSSFColor(new Color(197, 217, 241));
	public final static XSSFColor poiBlue2 = new XSSFColor(new Color(0, 0, 255));
	public final static XSSFColor poiPink = new XSSFColor(new Color(255, 204, 255));
	public static final String ARIAL_FONT_NAME = "Arial";
	public static final String TIMES_NEW_ROMAN_FONT_NAME = "Times New Roman";
	// Mau cam tang dan theo cap do 01....0n (n>1)
	public final static XSSFColor poiGreen04 = new XSSFColor(new Color(0, 176, 80));// mau xanh la cay 04

	public final static String NORMAL_BORDER = "normal_border";// chu thuong, can trai, co vien
	public final static String NORMAL_CENTER_BORDER = "normal_center_border";// chu thuong, can giua, co vien
	public final static String NORMAL_NUMBER_BORDER = "normal_number_border";// so, co vien
	public final static String HEADER_GREEN04_ALl_THIN_WRAPTEXT = "header_green04_all_thin_wraptext";// 4 vien kieu
																										// thin, header
																										// mau xanh

	public final static String STYLE_HEADER_PINK = "header_pink";
	public final static String STYLE_HEADER_GREEN = "header_green";
	public final static String STYLE_HYBERLINK = "STYLE_HYBERLINK";

	/**
	 * Substitute.
	 *
	 * @param zipfile the zipfile
	 * @param tmpfile the tmpfile
	 * @param entry   the entry
	 * @param out     the out
	 * @throws IOException Signals that an I/O exception has occurred.
	 * @author hungtx
	 * @since Aug 19, 2013
	 */
	public static void substitute(File zipfile, File tmpfile, String entry, OutputStream out) throws IOException {
		ZipFile zip = new ZipFile(zipfile);

		ZipOutputStream zos = new ZipOutputStream(out);

		@SuppressWarnings("unchecked")
		Enumeration<ZipEntry> en = (Enumeration<ZipEntry>) zip.entries();
		while (en.hasMoreElements()) {
			ZipEntry ze = en.nextElement();
			if (!ze.getName().equals(entry)) {
				zos.putNextEntry(new ZipEntry(ze.getName()));
				InputStream is = zip.getInputStream(ze);
				ExcelPOIUtils.copyStream(is, zos);
				is.close();
			}
		}
		zos.putNextEntry(new ZipEntry(entry));
		InputStream is = new FileInputStream(tmpfile);
		ExcelPOIUtils.copyStream(is, zos);
		is.close();

		zos.close();
		zip.close();
	}

	/**
	 * Copy stream.
	 *
	 * @param in  the in
	 * @param out the out
	 * @throws IOException Signals that an I/O exception has occurred.
	 * @author hunglm16
	 * @since February 27, 2014
	 */
	private static void copyStream(InputStream in, OutputStream out) throws IOException {
		byte[] chunk = new byte[1024];
		int count;
		while ((count = in.read(chunk)) >= 0) {
			out.write(chunk, 0, count);
		}
	}

	/**
	 * Khoi tao Workbook
	 *
	 * @author hunglm16
	 * @param wb
	 * @return // * @throws WriteException
	 * @sine October 09, 2015
	 */
	public static Map<String, XSSFCellStyle> createStyles(Workbook wb) throws Exception {
		Map<String, XSSFCellStyle> styles = new HashMap<>();
		XSSFDataFormat fmt = (XSSFDataFormat) wb.createDataFormat();

		// Init Font
		XSSFFont headerFont = (XSSFFont) wb.createFont();
		XSSFFont rowFont = (XSSFFont) wb.createFont();
		XSSFFont detailRedFont = (XSSFFont) wb.createFont();
		XSSFFont menuFont = (XSSFFont) wb.createFont();
		XSSFFont menuFontSaleMT = (XSSFFont) wb.createFont();
		XSSFFont menuFontGray = (XSSFFont) wb.createFont();
		XSSFFont boldFont = (XSSFFont) wb.createFont();
		XSSFFont normalFont = (XSSFFont) wb.createFont();
		XSSFFont rowNormalFont = (XSSFFont) wb.createFont();
		XSSFFont detailNormalRedFont = (XSSFFont) wb.createFont();
		XSSFFont rowBoldFont = (XSSFFont) wb.createFont();
		XSSFFont rowBoldRedFont = (XSSFFont) wb.createFont();
		XSSFFont rowBoldTitle = (XSSFFont) wb.createFont();
		XSSFFont rowBoldTitleNutil = (XSSFFont) wb.createFont();
		XSSFFont rowBoldTitleBrown = (XSSFFont) wb.createFont();
		XSSFFont rowBoldTitleBlue = (XSSFFont) wb.createFont();
		XSSFFont timesNewRomanBoldFont11 = (XSSFFont) wb.createFont();
		XSSFFont timesNewRomanNormalFont12 = (XSSFFont) wb.createFont();
		XSSFFont timesNewRomanNormalFont13 = (XSSFFont) wb.createFont();
		XSSFFont timesNewRomanBoldFont12 = (XSSFFont) wb.createFont();
		XSSFFont timesNewRomanBoldFont12Red = (XSSFFont) wb.createFont();
		XSSFFont timesNewRomanBoldFont12White = (XSSFFont) wb.createFont();
		XSSFFont timesNewRomanBoldFont13 = (XSSFFont) wb.createFont();
		XSSFFont timesNewRomanBoldFont20 = (XSSFFont) wb.createFont();

		XSSFFont font = (XSSFFont) wb.createFont();
		font.setFontName(ExcelPOIUtils.TIMES_NEW_ROMAN_FONT_NAME);

		// set font
		ExcelPOIUtils.setFontPOI(headerFont, "Arial", 10, true, ExcelPOIUtils.poiBlue);
		ExcelPOIUtils.setFontPOI(rowFont, "Arial", 9, false, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(detailRedFont, "Arial", 9, false, ExcelPOIUtils.poiRed);
		ExcelPOIUtils.setFontPOI(menuFont, "Arial", 9, true, ExcelPOIUtils.poiWhite);
		ExcelPOIUtils.setFontPOI(menuFontSaleMT, "Arial", 9, true, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(menuFontGray, "Arial", 9, true, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(boldFont, "Arial", 9, true, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(normalFont, "Arial", 9, false, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(rowBoldFont, "Arial", 9, true, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(rowBoldRedFont, "Arial", 9, true, ExcelPOIUtils.poiRed);
		ExcelPOIUtils.setFontPOI(rowNormalFont, "Arial", 9, false, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(detailNormalRedFont, "Arial", 9, false, ExcelPOIUtils.poiRed);
		ExcelPOIUtils.setFontPOI(rowBoldTitle, "Arial", 12, true, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(rowBoldTitleNutil, "Arial", 16, true, ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(rowBoldTitleBrown, "Arial", 16, true, ExcelPOIUtils.poiBrown);
		ExcelPOIUtils.setFontPOI(rowBoldTitleBlue, "Arial", 12, true, ExcelPOIUtils.poiBlue);
		ExcelPOIUtils.setFontPOI(timesNewRomanNormalFont12, ExcelPOIUtils.TIMES_NEW_ROMAN_FONT_NAME, 12, false,
				ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(timesNewRomanBoldFont12, ExcelPOIUtils.TIMES_NEW_ROMAN_FONT_NAME, 12, true,
				ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(timesNewRomanBoldFont12Red, ExcelPOIUtils.TIMES_NEW_ROMAN_FONT_NAME, 12, true,
				ExcelPOIUtils.poiRed);
		ExcelPOIUtils.setFontPOI(timesNewRomanBoldFont12White, ExcelPOIUtils.TIMES_NEW_ROMAN_FONT_NAME, 12, true,
				ExcelPOIUtils.poiWhite);
		ExcelPOIUtils.setFontPOI(timesNewRomanBoldFont13, ExcelPOIUtils.TIMES_NEW_ROMAN_FONT_NAME, 13, true,
				ExcelPOIUtils.poiBlack);
		ExcelPOIUtils.setFontPOI(timesNewRomanBoldFont20, ExcelPOIUtils.TIMES_NEW_ROMAN_FONT_NAME, 20, true,
				ExcelPOIUtils.poiBlack);

		// Set Cell Styles
		// HEADER
		XSSFCellStyle headerCellFormat = (XSSFCellStyle) wb.createCellStyle();
		headerCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		headerCellFormat.setFont(boldFont);
		styles.put(ExcelPOIUtils.HEADER, headerCellFormat);

		// MENU
		XSSFCellStyle menuCellFormat = (XSSFCellStyle) wb.createCellStyle();
		menuCellFormat.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		menuCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// menuCellFormat.setWrapText(true);
		menuCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		menuCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(menuCellFormat, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		menuCellFormat.setFont(menuFont);
		styles.put(ExcelPOIUtils.MENU, menuCellFormat);

		// MENU_GRAY
		XSSFCellStyle menuGrayCellFormat = (XSSFCellStyle) wb.createCellStyle();
		menuGrayCellFormat.setFillForegroundColor(ExcelPOIUtils.poiGray);
		menuGrayCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// menuGrayCellFormat.setWrapText(true);
		menuGrayCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		menuGrayCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(menuGrayCellFormat, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack);
		menuGrayCellFormat.setFont(menuFontGray);
		styles.put(ExcelPOIUtils.MENU_GRAY, menuGrayCellFormat);

		// MENU_RED
		XSSFCellStyle menuRedCellFormat = (XSSFCellStyle) wb.createCellStyle();
		menuRedCellFormat.setFillForegroundColor(ExcelPOIUtils.poiRed);
		menuRedCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// menuRedCellFormat.setWrapText(true);
		menuRedCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		menuRedCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(menuRedCellFormat, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack);
		menuRedCellFormat.setFont(menuFont);
		styles.put(ExcelPOIUtils.MENU_RED, menuRedCellFormat);

		// tamvnm: 21/07/2015
		// MENU_BLUE
		XSSFCellStyle menuBlueCellFormat = (XSSFCellStyle) wb.createCellStyle();
		menuBlueCellFormat.setFillForegroundColor(ExcelPOIUtils.poiBlue1);
		menuBlueCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// menuRedCellFormat.setWrapText(true);
		menuBlueCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		menuBlueCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);

		menuBlueCellFormat.setFont(timesNewRomanBoldFont12);
		styles.put(ExcelPOIUtils.MENU_BLUE, menuBlueCellFormat);

		// tamvnm: 21/07/2015
		// MENU_PINK
		XSSFCellStyle menuPinkCellFormat = (XSSFCellStyle) wb.createCellStyle();
		menuPinkCellFormat.setFillForegroundColor(ExcelPOIUtils.poiPink);
		menuPinkCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// menuRedCellFormat.setWrapText(true);
		menuPinkCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		menuPinkCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		menuPinkCellFormat.setFont(timesNewRomanBoldFont12);
		styles.put(ExcelPOIUtils.MENU_PINK, menuPinkCellFormat);

		// tamvnm: 22/07/2015
		// YELLOW_TIMES_NORMAL_12
		XSSFCellStyle yellowTimesNomarl12 = (XSSFCellStyle) wb.createCellStyle();
		yellowTimesNomarl12.setFillForegroundColor(ExcelPOIUtils.poiYellow);
		yellowTimesNomarl12.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// menuRedCellFormat.setWrapText(true);
		yellowTimesNomarl12.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		yellowTimesNomarl12.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		yellowTimesNomarl12.setFont(timesNewRomanNormalFont12);
		styles.put(ExcelPOIUtils.YELLOW_TIMES_NORMAL_12, yellowTimesNomarl12);

		// tamvnm: 22/07/2015
		// YELLOW_TIMES_BOLD_12
		XSSFCellStyle yellowTimesBoldl12 = (XSSFCellStyle) wb.createCellStyle();
		yellowTimesBoldl12.setFillForegroundColor(ExcelPOIUtils.poiYellow);
		yellowTimesBoldl12.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// menuRedCellFormat.setWrapText(true);
		yellowTimesBoldl12.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		yellowTimesBoldl12.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		yellowTimesBoldl12.setFont(timesNewRomanBoldFont12);
		styles.put(ExcelPOIUtils.YELLOW_TIMES_BOLD_12, yellowTimesBoldl12);

		// BOLD
		XSSFCellStyle boldNoBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		boldNoBorderCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		boldNoBorderCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		boldNoBorderCellFormat.setFont(boldFont);
		styles.put(ExcelPOIUtils.BOLD, boldNoBorderCellFormat);

		// BOLD_LEFT
		XSSFCellStyle boldNoBorderCellFormatLeft = (XSSFCellStyle) wb.createCellStyle();
		boldNoBorderCellFormatLeft.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		boldNoBorderCellFormatLeft.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		boldNoBorderCellFormatLeft.setFont(boldFont);
		styles.put(ExcelPOIUtils.BOLD_LEFT, boldNoBorderCellFormatLeft);

		// BOLD_RIGHT
		XSSFCellStyle boldNoBorderCellFormatRight = (XSSFCellStyle) wb.createCellStyle();
		boldNoBorderCellFormatRight.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		boldNoBorderCellFormatRight.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		boldNoBorderCellFormatRight.setFont(boldFont);
		boldNoBorderCellFormatRight.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.BOLD_RIGHT, boldNoBorderCellFormatRight);

		// BOLD_LEFT_PERCENT
		XSSFCellStyle boldNoBorderCellFormatLeftPercent = (XSSFCellStyle) wb.createCellStyle();
		boldNoBorderCellFormatLeftPercent.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		boldNoBorderCellFormatLeftPercent.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		boldNoBorderCellFormatLeftPercent.setFont(boldFont);
		boldNoBorderCellFormatLeftPercent.setDataFormat(fmt.getFormat("0.0\\%;-0.0\\%;0.0\\%"));
		styles.put(ExcelPOIUtils.BOLD_LEFT_PERCENT, boldNoBorderCellFormatLeftPercent);

		// BOLD_LEFT_NUMBER
		XSSFCellStyle boldNoBorderCellFormatLeftNumber = (XSSFCellStyle) wb.createCellStyle();
		boldNoBorderCellFormatLeftNumber.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		boldNoBorderCellFormatLeftNumber.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		boldNoBorderCellFormatLeftNumber.setFont(boldFont);
		boldNoBorderCellFormatLeftNumber.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.BOLD_LEFT_NUMBER, boldNoBorderCellFormatLeftNumber);

		// HEADER_BLUE_TOP_BOTTOM_MEDIUM
		XSSFCellStyle headerBlueTopBottomMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueTopBottomMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueTopBottomMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueTopBottomMedium.setWrapText(true);
		headerBlueTopBottomMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueTopBottomMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueTopBottomMedium, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN, null, BorderStyle.THIN);
		headerBlueTopBottomMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_TOP_BOTTOM_MEDIUM, headerBlueTopBottomMedium);

		// HEADER_GREY_NONE_MEDIUM
		XSSFCellStyle headerGreyNoneMedium = (XSSFCellStyle) wb.createCellStyle();
		headerGreyNoneMedium.setFillForegroundColor(ExcelPOIUtils.poiGrey);
		headerGreyNoneMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerGreyNoneMedium.setWrapText(true);
		headerGreyNoneMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		headerGreyNoneMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerGreyNoneMedium, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack,
				BorderStyle.NONE, BorderStyle.NONE, BorderStyle.NONE, BorderStyle.NONE);
		headerGreyNoneMedium.setFont(menuFontGray);
		styles.put(ExcelPOIUtils.HEADER_GREY_NONE_MEDIUM, headerGreyNoneMedium);

		// HEADER_BLUE_NONE_MEDIUM
		XSSFCellStyle headerBlueNoneMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueNoneMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue01);
		headerBlueNoneMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerBlueNoneMedium.setWrapText(true);
		headerBlueNoneMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueNoneMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueNoneMedium, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN, null, BorderStyle.THIN);
		headerBlueNoneMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_NONE_MEDIUM, headerBlueNoneMedium);

		// HEADER_BLUE_2_NONE_MEDIUM
		XSSFCellStyle headerBlue2NoneMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlue2NoneMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue02);
		headerBlue2NoneMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerBlue2NoneMedium.setWrapText(true);
		headerBlue2NoneMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlue2NoneMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlue2NoneMedium, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack,
				BorderStyle.THIN, BorderStyle.THIN, BorderStyle.THIN, BorderStyle.THIN);
		headerBlue2NoneMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_2_NONE_MEDIUM, headerBlue2NoneMedium);

		// HEADER_GRAY_TOP_BOTTOM_MEDIUM
		XSSFCellStyle headerGrayTopBottomMedium = (XSSFCellStyle) wb.createCellStyle();
		headerGrayTopBottomMedium.setFillForegroundColor(ExcelPOIUtils.poiGray);
		headerGrayTopBottomMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerGrayTopBottomMedium.setWrapText(true);
		headerGrayTopBottomMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerGrayTopBottomMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerGrayTopBottomMedium, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN, null, BorderStyle.THIN);
		headerGrayTopBottomMedium.setFont(menuFontSaleMT);
		styles.put(ExcelPOIUtils.HEADER_GRAY_TOP_BOTTOM_MEDIUM, headerGrayTopBottomMedium);

		// HEADER_BLUE_TOP_RIGHT_MEDIUM
		XSSFCellStyle headerBlueTopRightMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueTopRightMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueTopRightMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueTopRightMedium.setWrapText(true);
		headerBlueTopRightMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueTopRightMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueTopRightMedium, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack, null, null,
				null, BorderStyle.THIN);
		headerBlueTopRightMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_TOP_RIGHT_MEDIUM, headerBlueTopRightMedium);

		// HEADER_BLUE_ALL_THIN
		XSSFCellStyle headerBlueAllThin = (XSSFCellStyle) wb.createCellStyle();
		headerBlueAllThin.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueAllThin.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueAllThin.setWrapText(true);
		headerBlueAllThin.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueAllThin.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueAllThin, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		headerBlueAllThin.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_ALL_THIN, headerBlueAllThin);

		// HEADER_BLUE_ALL_THIN_WRAP
		XSSFCellStyle headerBlueAllThinWrap = (XSSFCellStyle) wb.createCellStyle();
		headerBlueAllThinWrap.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueAllThinWrap.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerBlueAllThinWrap.setWrapText(true);
		headerBlueAllThinWrap.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueAllThinWrap.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueAllThinWrap, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		headerBlueAllThinWrap.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_ALL_THIN_WRAP, headerBlueAllThinWrap);

		// HEADER_BLUE_ALL_THIN_WRAP2
		XSSFCellStyle headerBlueAllThinWrap2 = (XSSFCellStyle) wb.createCellStyle();
		headerBlueAllThinWrap2.setFillForegroundColor(ExcelPOIUtils.poiBlue2);
		headerBlueAllThinWrap2.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerBlueAllThinWrap2.setWrapText(true);
		headerBlueAllThinWrap2.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueAllThinWrap2.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueAllThinWrap2, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		headerBlueAllThinWrap2.setFont(timesNewRomanBoldFont12White);
		styles.put(ExcelPOIUtils.HEADER_BLUE_ALL_THIN_WRAP2, headerBlueAllThinWrap2);

		// HEADER_BLUE_ALL_THIN_TOP_MEDIUM
		XSSFCellStyle headerBlueAllThinTopMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueAllThinTopMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueAllThinTopMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueAllThinTopMedium.setWrapText(true);
		headerBlueAllThinTopMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueAllThinTopMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueAllThinTopMedium, BorderStyle.THIN, ExcelPOIUtils.poiBlack,
				BorderStyle.MEDIUM);
		headerBlueAllThinTopMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_ALL_THIN_TOP_MEDIUM, headerBlueAllThinTopMedium);

		// HEADER_BLUE_ALL_THIN_BOTTOM_MEDIUM
		XSSFCellStyle headerBlueAllThinBottomMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueAllThinBottomMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueAllThinBottomMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueAllThinBottomMedium.setWrapText(true);
		headerBlueAllThinBottomMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueAllThinBottomMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueAllThinBottomMedium, BorderStyle.THIN, ExcelPOIUtils.poiBlack, null,
				null, BorderStyle.MEDIUM);
		headerBlueAllThinBottomMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_ALL_THIN_BOTTOM_MEDIUM, headerBlueAllThinBottomMedium);

		// HEADER_BLUE_ALL_THIN_LEFT_MEDIUM
		XSSFCellStyle headerBlueAllThinLeftMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueAllThinLeftMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueAllThinLeftMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueAllThinLeftMedium.setWrapText(true);
		headerBlueAllThinLeftMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueAllThinLeftMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueAllThinLeftMedium, BorderStyle.THIN, ExcelPOIUtils.poiBlack, null,
				BorderStyle.MEDIUM);
		headerBlueAllThinLeftMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_ALL_THIN_LEFT_MEDIUM, headerBlueAllThinLeftMedium);

		// HEADER_BLUESEA_ALL_THIN_TOP_MEDIUM
		XSSFCellStyle headerBlueSeaAllThinTopMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueSeaAllThinTopMedium.setFillForegroundColor(ExcelPOIUtils.poiBlueSea);
		headerBlueSeaAllThinTopMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueSeaAllThinTopMedium.setWrapText(true);
		headerBlueSeaAllThinTopMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueSeaAllThinTopMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueSeaAllThinTopMedium, BorderStyle.THIN, ExcelPOIUtils.poiBlack,
				BorderStyle.MEDIUM);
		headerBlueSeaAllThinTopMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUESEA_ALL_THIN_TOP_MEDIUM, headerBlueSeaAllThinTopMedium);

		// HEADER_BLUESEA_ALL_THIN_BOTTOM_MEDIUM
		XSSFCellStyle headerBlueSeaAllThinBottomMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueSeaAllThinBottomMedium.setFillForegroundColor(ExcelPOIUtils.poiBlueSea);
		headerBlueSeaAllThinBottomMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueSeaAllThinBottomMedium.setWrapText(true);
		headerBlueSeaAllThinBottomMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueSeaAllThinBottomMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueSeaAllThinBottomMedium, BorderStyle.THIN, ExcelPOIUtils.poiBlack, null,
				null, BorderStyle.MEDIUM);
		headerBlueSeaAllThinBottomMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUESEA_ALL_THIN_BOTTOM_MEDIUM, headerBlueSeaAllThinBottomMedium);

		// HEADER_BLUE_ALL_MEDIUM_LEFT_THIN
		XSSFCellStyle headerBlueAllMediumLeftThin = (XSSFCellStyle) wb.createCellStyle();
		headerBlueAllMediumLeftThin.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueAllMediumLeftThin.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueAllMediumLeftThin.setWrapText(true);
		headerBlueAllMediumLeftThin.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueAllMediumLeftThin.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueAllMediumLeftThin, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN);
		headerBlueAllMediumLeftThin.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_ALL_MEDIUM_LEFT_THIN, headerBlueAllMediumLeftThin);

		// HEADER_BLUE_ALL_THIN_RIGTH_MEDIUM
		XSSFCellStyle headerBlueAllThinRightMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueAllThinRightMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueAllThinRightMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		// headerBlueAllThinRightMedium.setWrapText(true);
		headerBlueAllThinRightMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueAllThinRightMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueAllThinRightMedium, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN);
		headerBlueAllThinRightMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_ALL_THIN_RIGTH_MEDIUM, headerBlueAllThinRightMedium);

		// HEADER_BLUE_R_L_NONE_TOP_MEDIUM
		XSSFCellStyle headerBlueRLNoneTopMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueRLNoneTopMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueRLNoneTopMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerBlueRLNoneTopMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueRLNoneTopMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueRLNoneTopMedium, BorderStyle.NONE, ExcelPOIUtils.poiBlack,
				BorderStyle.MEDIUM);
		headerBlueRLNoneTopMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_R_L_NONE_TOP_MEDIUM, headerBlueRLNoneTopMedium);
		// HEADER_BLUE_R_L_THIN_TOP_MEDIUM
		XSSFCellStyle headerBlueRLThinTopMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueRLThinTopMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueRLThinTopMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerBlueRLThinTopMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueRLThinTopMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueRLThinTopMedium, BorderStyle.THIN, ExcelPOIUtils.poiBlack,
				BorderStyle.MEDIUM, null, BorderStyle.NONE);
		headerBlueRLThinTopMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_R_L_THIN_TOP_MEDIUM, headerBlueRLThinTopMedium);
		// HEADER_BLUE_R_L_THIN_BOTTOM_MEDIUM
		XSSFCellStyle headerBlueRLThinBottomMedium = (XSSFCellStyle) wb.createCellStyle();
		headerBlueRLThinBottomMedium.setFillForegroundColor(ExcelPOIUtils.poiBlue);
		headerBlueRLThinBottomMedium.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerBlueRLThinBottomMedium.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerBlueRLThinBottomMedium.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerBlueRLThinBottomMedium, BorderStyle.THIN, ExcelPOIUtils.poiBlack,
				BorderStyle.NONE, null, BorderStyle.MEDIUM);
		headerBlueRLThinBottomMedium.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_BLUE_R_L_THIN_BOTTOM_MEDIUM, headerBlueRLThinBottomMedium);

		// HEADER_GREEN_ALL_THIN
		XSSFCellStyle headerGreenAllThin = (XSSFCellStyle) wb.createCellStyle();
		headerGreenAllThin.setFillForegroundColor(ExcelPOIUtils.poiGreen02);
		headerGreenAllThin.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerGreenAllThin.setWrapText(true);
		headerGreenAllThin.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerGreenAllThin.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerGreenAllThin, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		headerGreenAllThin.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_GREEN_ALL_THIN, headerGreenAllThin);

		// HEADER_GREEN_ALL_THIN_BOLD
		XSSFCellStyle headerGreenAllThinBold = (XSSFCellStyle) wb.createCellStyle();
		headerGreenAllThinBold.setFillForegroundColor(ExcelPOIUtils.poiGreen02);
		headerGreenAllThinBold.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerGreenAllThinBold.setWrapText(true);
		headerGreenAllThinBold.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerGreenAllThinBold.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerGreenAllThinBold, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		headerGreenAllThinBold.setFont(timesNewRomanBoldFont11);
		styles.put(ExcelPOIUtils.HEADER_GREEN_ALL_THIN_BOLD, headerGreenAllThinBold);

		// tamvnm: 21/07/2015
		// HEADER_GREEN_ALl_THIN_WRAPTEXT
		XSSFCellStyle headerGreenWraptext = (XSSFCellStyle) wb.createCellStyle();
		headerGreenWraptext.setFillForegroundColor(ExcelPOIUtils.poiGreen03);
		headerGreenWraptext.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerGreenWraptext.setWrapText(true);
		headerGreenWraptext.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerGreenWraptext.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerGreenWraptext, BorderStyle.THIN, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN, null, BorderStyle.THIN);
		headerGreenWraptext.setFont(timesNewRomanBoldFont12);
		styles.put(ExcelPOIUtils.HEADER_GREEN_ALl_THIN_WRAPTEXT, headerGreenWraptext);

		// tamvnm: 21/07/2015
		// HEADER_RED_ALl_THIN_WRAPTEXT
		XSSFCellStyle headerRedWraptext = (XSSFCellStyle) wb.createCellStyle();
		headerRedWraptext.setFillForegroundColor(ExcelPOIUtils.poiRed);
		headerRedWraptext.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerRedWraptext.setWrapText(true);
		headerRedWraptext.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerRedWraptext.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerRedWraptext, BorderStyle.THIN, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN, null, BorderStyle.THIN);
		headerRedWraptext.setFont(timesNewRomanBoldFont12);
		styles.put(ExcelPOIUtils.HEADER_RED_ALl_THIN_WRAPTEXT, headerRedWraptext);

		// tamvnm: 10/08/2015
		// HEADER_YELLOW_ALl_THIN_WRAPTEXT_RED
		XSSFCellStyle headerYellowWraptextRed = (XSSFCellStyle) wb.createCellStyle();
		headerYellowWraptextRed.setFillForegroundColor(ExcelPOIUtils.poiYellow2);
		headerYellowWraptextRed.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerYellowWraptextRed.setWrapText(true);
		headerYellowWraptextRed.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerYellowWraptextRed.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerYellowWraptextRed, BorderStyle.THIN, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN, null, BorderStyle.THIN);
		headerYellowWraptextRed.setFont(timesNewRomanBoldFont12Red);
		styles.put(ExcelPOIUtils.HEADER_YELLOW_ALl_THIN_WRAPTEXT_RED, headerYellowWraptextRed);

		// TIMES_TITLE
		XSSFCellStyle timesTitleCellFormat = (XSSFCellStyle) wb.createCellStyle();
		timesTitleCellFormat.setFont(boldFont);
		// timesTitleCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		timesTitleCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TIMES_TITLE, timesTitleCellFormat);

		XSSFCellStyle timesTitleCellFormat2 = (XSSFCellStyle) timesTitleCellFormat.clone();
		timesTitleCellFormat2.setAlignment(HorizontalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TIMES_TITLE2, timesTitleCellFormat2);

		// TITLE_VNM_BLACK
		XSSFCellStyle titleVNMCellFormat = (XSSFCellStyle) wb.createCellStyle();
		titleVNMCellFormat.setFont(rowBoldTitle);
		titleVNMCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		titleVNMCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TITLE_VNM_BLACK, titleVNMCellFormat);

		// TITLE_NUTI_BLACK
		XSSFCellStyle titleNutiCellFormat = (XSSFCellStyle) wb.createCellStyle();
		titleNutiCellFormat.setFont(rowBoldTitleNutil);
		titleNutiCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		titleNutiCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TITLE_NUTI_BLACK, titleNutiCellFormat);

		// TITLE_NUTI_BROWN
		XSSFCellStyle titleBrownNutiCellFormat = (XSSFCellStyle) wb.createCellStyle();
		titleBrownNutiCellFormat.setFont(rowBoldTitleBrown);
		titleBrownNutiCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		titleBrownNutiCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TITLE_NUTI_BROWN, titleBrownNutiCellFormat);

		// TITLE_NUTI_BROWN_LEFT
		XSSFCellStyle titleBrownNutiLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		titleBrownNutiLeftCellFormat.setFont(rowBoldTitleBrown);
		titleBrownNutiLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		titleBrownNutiLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TITLE_NUTI_BROWN_LEFT, titleBrownNutiLeftCellFormat);

		// TITLE_VNM_BLACK
		XSSFCellStyle titleVNMCellFormatSaleMT = (XSSFCellStyle) wb.createCellStyle();
		titleVNMCellFormatSaleMT.setFont(rowBoldTitle);
		titleVNMCellFormatSaleMT.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		titleVNMCellFormatSaleMT.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TITLE_VNM_BLACK_SALEMT, titleVNMCellFormatSaleMT);

		// TITLE_BLUE
		XSSFCellStyle titleBlueCellFormat = (XSSFCellStyle) wb.createCellStyle();
		titleBlueCellFormat.setFont(rowBoldTitleBlue);
		titleBlueCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		titleBlueCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TITLE_BLUE, titleBlueCellFormat);

		// TIMES_BOLD_20
		XSSFCellStyle timesBold20 = (XSSFCellStyle) wb.createCellStyle();
		timesBold20.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		timesBold20.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		timesBold20.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		timesBold20.setFont(timesNewRomanBoldFont20);
		styles.put(ExcelPOIUtils.TIMES_BOLD_20, timesBold20);

		// TIMES_NORMAL_12
		XSSFCellStyle timesNormal12 = (XSSFCellStyle) wb.createCellStyle();
		timesNormal12.setFont(timesNewRomanNormalFont12);
		styles.put(ExcelPOIUtils.TIMES_NORMAL_12, timesNormal12);

		// TIMES_NORMAL_13
		XSSFCellStyle timesNormal13 = (XSSFCellStyle) wb.createCellStyle();
		timesNormal13.setFont(timesNewRomanNormalFont13);
		timesNormal13.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.TIMES_NORMAL_13, timesNormal13);

		// TIMES_BOLD_13
		XSSFCellStyle timesBold13 = (XSSFCellStyle) wb.createCellStyle();
		timesBold13.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		timesBold13.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		timesBold13.setFont(timesNewRomanBoldFont13);
		styles.put(ExcelPOIUtils.TIMES_BOLD_13, timesBold13);

		// TIMES_BOLD_13_1
		XSSFCellStyle timesBold131 = (XSSFCellStyle) wb.createCellStyle();
		timesBold131.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		timesBold131.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		timesBold131.setFont(timesNewRomanBoldFont13);
		styles.put(ExcelPOIUtils.TIMES_BOLD_13_1, timesBold131);

		// BOLD_CENTER
		XSSFCellStyle boldCenterNoBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		boldCenterNoBorderCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		boldCenterNoBorderCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		boldCenterNoBorderCellFormat.setFont(boldFont);
		styles.put(ExcelPOIUtils.BOLD_CENTER, boldCenterNoBorderCellFormat);

		// NORMAL
		XSSFCellStyle normalCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalCellFormat.setFont(normalFont);
		styles.put(ExcelPOIUtils.NORMAL, normalCellFormat);

		XSSFCellStyle normalCenterNoBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalCenterNoBorderCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		normalCenterNoBorderCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		normalCenterNoBorderCellFormat.setFont(normalFont);
		styles.put(ExcelPOIUtils.NORMAL_CENTER, normalCenterNoBorderCellFormat);

		XSSFCellStyle normalCenterLeftNoBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalCenterLeftNoBorderCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		normalCenterLeftNoBorderCellFormat.setFont(normalFont);
		styles.put(ExcelPOIUtils.NORMAL_CENTER_LEFT, normalCenterLeftNoBorderCellFormat);

		XSSFCellStyle normalNumberCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalNumberCellFormat.setFont(normalFont);
		normalNumberCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.NORMAL_NUMBER, normalNumberCellFormat);

		// NORMAL_NUMBER_RIGHT vuongmq; 20/04/2015
		XSSFCellStyle normalNumberRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalNumberRightCellFormat.setFont(normalFont);
		normalNumberRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		normalNumberRightCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.NORMAL_NUMBER_RIGHT, normalNumberRightCellFormat);

		XSSFCellStyle normalMediumTopBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalMediumTopBorderCellFormat.setFont(normalFont);
		normalMediumTopBorderCellFormat.setBorderTop(BorderStyle.MEDIUM);
		normalMediumTopBorderCellFormat.setBorderColor(BorderSide.TOP, ExcelPOIUtils.poiBlack);
		styles.put(ExcelPOIUtils.MEDIUM_TOP_BORDER, normalMediumTopBorderCellFormat);

		XSSFCellStyle normalMediumLeftBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalMediumLeftBorderCellFormat.setFont(normalFont);
		normalMediumLeftBorderCellFormat.setBorderTop(BorderStyle.MEDIUM);
		normalMediumLeftBorderCellFormat.setBorderColor(BorderSide.LEFT, ExcelPOIUtils.poiBlack);
		styles.put(ExcelPOIUtils.MEDIUM_LEFT_BORDER, normalMediumLeftBorderCellFormat);

		XSSFCellStyle normalMediumRightBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalMediumRightBorderCellFormat.setFont(normalFont);
		normalMediumRightBorderCellFormat.setBorderTop(BorderStyle.MEDIUM);
		normalMediumRightBorderCellFormat.setBorderColor(BorderSide.RIGHT, ExcelPOIUtils.poiBlack);
		styles.put(ExcelPOIUtils.MEDIUM_RIGHT_BORDER, normalMediumRightBorderCellFormat);

		XSSFCellStyle normalMediumBottomBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		normalMediumBottomBorderCellFormat.setFont(normalFont);
		normalMediumBottomBorderCellFormat.setBorderTop(BorderStyle.MEDIUM);
		normalMediumBottomBorderCellFormat.setBorderColor(BorderSide.BOTTOM, ExcelPOIUtils.poiBlack);
		styles.put(ExcelPOIUtils.MEDIUM_BOTTOM_BORDER, normalMediumRightBorderCellFormat);

		XSSFCellStyle detailNormalCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(detailNormalCellFormat, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		detailNormalCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.DETAIL_, detailNormalCellFormat);

		// ROW_DOTTED_CENTER
		XSSFCellStyle rowDottedCenterCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedCenterCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedCenterCellFormat.setFont(rowNormalFont);
		rowDottedCenterCellFormat.setDataFormat(fmt.getFormat("@"));
		rowDottedCenterCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowDottedCenterCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER, rowDottedCenterCellFormat);

		// ROW_DOTTED_CENTER_BO
		XSSFCellStyle rowDottedCenterBoCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedCenterBoCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedCenterBoCellFormat.setFont(boldFont);
		rowDottedCenterBoCellFormat.setDataFormat(fmt.getFormat("@"));
		rowDottedCenterBoCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowDottedCenterBoCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_BO, rowDottedCenterBoCellFormat);

		// ROW_DOTTED_CENTER_BOLD
		XSSFCellStyle rowDottedCenterBoldCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedCenterBoldCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedCenterBoldCellFormat.setFont(boldFont);
		rowDottedCenterBoldCellFormat.setDataFormat(fmt.getFormat("@"));
		rowDottedCenterBoldCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowDottedCenterBoldCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_BOLD, rowDottedCenterBoldCellFormat);

		// ROW_DOTTED_CENTER_RED
		XSSFCellStyle rowDottedCenterRedCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedCenterRedCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedCenterRedCellFormat.setFont(detailNormalRedFont);
		rowDottedCenterRedCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowDottedCenterRedCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_RED, rowDottedCenterRedCellFormat);

		// ROW_DOTTED_LEFT
		XSSFCellStyle rowDottedLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedLeftCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowDottedLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedLeftCellFormat.setFont(rowNormalFont);
		rowDottedLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		rowDottedLeftCellFormat.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT, rowDottedLeftCellFormat);

		// ROW_DOTTED_LEFT_NOT_WRAP
		XSSFCellStyle rowDottedLeftNotWrapCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedLeftNotWrapCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedLeftNotWrapCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowDottedLeftNotWrapCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedLeftNotWrapCellFormat.setFont(rowNormalFont);
		rowDottedLeftNotWrapCellFormat.setDataFormat(fmt.getFormat("@"));
		rowDottedLeftNotWrapCellFormat.setWrapText(false);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_NOT_WRAP, rowDottedLeftNotWrapCellFormat);

		// ROW_DOTTED_WRAP_LEFT
		XSSFCellStyle rowDottedWrapLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedWrapLeftCellFormat, BorderStyle.HAIR, ExcelPOIUtils.poiBlack);
		rowDottedWrapLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowDottedWrapLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedWrapLeftCellFormat.setFont(rowNormalFont);
		rowDottedWrapLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		rowDottedWrapLeftCellFormat.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_WRAP_LEFT, rowDottedWrapLeftCellFormat);

		// ROW_DOTTED_LEFT_NUTI
		XSSFCellStyle rowDottedLeftCellFormatNuti = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedLeftCellFormatNuti, BorderStyle.DOTTED, ExcelPOIUtils.poiYearlow);
		rowDottedLeftCellFormatNuti.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowDottedLeftCellFormatNuti.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedLeftCellFormatNuti.setFont(rowBoldFont);
		rowDottedLeftCellFormatNuti.setDataFormat(fmt.getFormat("@"));
		rowDottedLeftCellFormatNuti.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_NUTI, rowDottedLeftCellFormatNuti);

		// ROW_DOTTED_LEFT_BOLD
		XSSFCellStyle rowDottedLeftBoldCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedLeftBoldCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedLeftBoldCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowDottedLeftBoldCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedLeftBoldCellFormat.setFont(boldFont);
		rowDottedLeftBoldCellFormat.setDataFormat(fmt.getFormat("@"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_BOLD, rowDottedLeftBoldCellFormat);

		// ROW_DOTTED_RIGHT
		XSSFCellStyle rowDottedRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		rowDottedRightCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT, rowDottedRightCellFormat);

		// ROW_DOTTED_RIGHT_NOT_ZERO
		XSSFCellStyle rowDottedRightNotZeroCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightNotZeroCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightNotZeroCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightNotZeroCellFormat.setDataFormat(fmt.getFormat("#,##"));
		rowDottedRightNotZeroCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightNotZeroCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_NOT_ZERO, rowDottedRightNotZeroCellFormat);

		// ROW_DOTTED_ACCOUNTING
		XSSFCellStyle rowDottedAccountingCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedAccountingCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedAccountingCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedAccountingCellFormat.setDataFormat(fmt.getFormat("_(* #,##0.00_);_(* (#,##0.00);_(* \"-\"_);_(@_)"));
		rowDottedAccountingCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedAccountingCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_ACCOUNTING, rowDottedAccountingCellFormat);

		// ROW_DOTTED_RIGHT_FLOAT
		XSSFCellStyle rowDottedRightFloatCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightFloatCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightFloatCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightFloatCellFormat.setDataFormat(fmt.getFormat("#,##0.00"));
		rowDottedRightFloatCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightFloatCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_FLOAT, rowDottedRightFloatCellFormat);

		// ROW_DOTTED_RIGHT_FLOAT_TWO
		XSSFCellStyle rowDottedRightFloatTwoCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightFloatTwoCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightFloatTwoCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightFloatTwoCellFormat.setDataFormat(fmt.getFormat("#,##0.00"));
		rowDottedRightFloatTwoCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightFloatTwoCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_FLOAT_TWO, rowDottedRightFloatTwoCellFormat);

		// ROW_DOTTED_RIGHT_FLOAT_BOLD_TWO
		XSSFCellStyle rowDottedRightFloatBoldTwoCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightFloatBoldTwoCellFormat, BorderStyle.DOTTED,
				ExcelPOIUtils.poiBlack);
		rowDottedRightFloatBoldTwoCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightFloatBoldTwoCellFormat.setDataFormat(fmt.getFormat("#,##0.00"));
		rowDottedRightFloatBoldTwoCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightFloatBoldTwoCellFormat.setFont(boldFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_FLOAT_BOLD_TWO, rowDottedRightFloatBoldTwoCellFormat);

		// ROW_DOTTED_RIGHT_LATLNG
		XSSFCellStyle rowDottedRightLatlngCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightLatlngCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightLatlngCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightLatlngCellFormat.setDataFormat(fmt.getFormat("#,########0.00000000"));
		rowDottedRightLatlngCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightLatlngCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_FLOAT, rowDottedRightLatlngCellFormat);

		// ROW_DOTTED_RIGHT_TEXT
		XSSFCellStyle rowDottedRightCellFormatText = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightCellFormatText, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightCellFormatText.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightCellFormatText.setDataFormat(fmt.getFormat("@"));
		rowDottedRightCellFormatText.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightCellFormatText.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_TEXT, rowDottedRightCellFormat);

		// ROW_DOTTED_RIGHT_BOLD
		XSSFCellStyle rowDottedRightBoldCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightBoldCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightBoldCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightBoldCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		rowDottedRightBoldCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightBoldCellFormat.setFont(boldFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_BOLD, rowDottedRightBoldCellFormat);

		// ROW_DOTTED_RIGHT_RED
		XSSFCellStyle rowDottedRightCellFormatRed = (XSSFCellStyle) wb.createCellStyle();
		rowDottedRightCellFormatRed.setFont(rowBoldRedFont);
		ExcelPOIUtils.setBorderForCell(rowDottedRightCellFormatRed, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightCellFormatRed.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightCellFormatRed.setDataFormat(fmt.getFormat("#,##"));
		rowDottedRightCellFormatRed.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_RED, rowDottedRightCellFormatRed);

		// ROW_DOTTED_RIGHT_PERCENT
		XSSFCellStyle rowDottedRightCellFormatPercent = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightCellFormatPercent, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightCellFormatPercent.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightCellFormatPercent.setDataFormat(fmt.getFormat("0.00\\%;-0.00\\%;0.00\\%"));
		rowDottedRightCellFormatPercent.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightCellFormatPercent.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_PERCENT, rowDottedRightCellFormatPercent);

		// ROW_DOTTED_RIGHT_PERCENT_BOLD vuongmq
		XSSFCellStyle rowDottedRightCellFormatPercentBold = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightCellFormatPercentBold, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightCellFormatPercentBold.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightCellFormatPercentBold.setDataFormat(fmt.getFormat("0.00\\%;-0.00\\%;0.00\\%"));
		rowDottedRightCellFormatPercentBold.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightCellFormatPercentBold.setFont(boldFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_PERCENT_BOLD, rowDottedRightCellFormatPercentBold);

		// ROW_DOTTED_RIGHT_FM_ZEZO
		XSSFCellStyle rowDottedRightCellFormatZeZo = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowDottedRightCellFormatZeZo, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowDottedRightCellFormatZeZo.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowDottedRightCellFormatZeZo.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowDottedRightCellFormatZeZo.setDataFormat(fmt.getFormat("#,##0"));
		rowDottedRightCellFormatZeZo.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_FM_ZEZO, rowDottedRightCellFormatZeZo);

		// ROW_CENTER
		XSSFCellStyle rowCenterCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowCenterCellFormat, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		rowCenterCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowCenterCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowCenterCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_CENTER, rowCenterCellFormat);

		// ROW_LEFT
		XSSFCellStyle rowLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowLeftCellFormat, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		rowLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowLeftCellFormat.setFont(rowNormalFont);
		styles.put(ExcelPOIUtils.ROW_LEFT, rowLeftCellFormat);

		// ROW_RIGHT
		XSSFCellStyle rowRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowRightCellFormat, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		rowRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowRightCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowRightCellFormat.setFont(rowNormalFont);
		rowRightCellFormat.setDataFormat(fmt.getFormat("#,##"));
		styles.put(ExcelPOIUtils.ROW_RIGHT, rowRightCellFormat);

		// ROW_RIGHT_FM_ZEZO
		XSSFCellStyle rowRightCellFormatZeZo = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowRightCellFormatZeZo, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		rowRightCellFormatZeZo.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowRightCellFormatZeZo.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowRightCellFormatZeZo.setFont(rowNormalFont);
		rowRightCellFormatZeZo.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_RIGHT_FM_ZEZO, rowRightCellFormatZeZo);

		// ROW_DOTTED_LEFT_BLUESKYLIGHT01
		XSSFCellStyle rowBlueSkyLight01DottedLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowBlueSkyLight01DottedLeftCellFormat, BorderStyle.DOTTED,
				ExcelPOIUtils.poiBlack);
		rowBlueSkyLight01DottedLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowBlueSkyLight01DottedLeftCellFormat
				.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowBlueSkyLight01DottedLeftCellFormat.setFillForegroundColor(ExcelPOIUtils.poiBlueSkyLight01);
		rowBlueSkyLight01DottedLeftCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowBlueSkyLight01DottedLeftCellFormat.setFont(rowBoldFont);
		rowBlueSkyLight01DottedLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_BLUESKYLIGHT01, rowBlueSkyLight01DottedLeftCellFormat);

		/* Xu ly backgrow cung bac mau cam 01.....06 */
		// ROW_DOTTED_LEFT_ORANGE01
		XSSFCellStyle rowOrange01DottedLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange01DottedLeftCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange01DottedLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowOrange01DottedLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange01DottedLeftCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange01);
		rowOrange01DottedLeftCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange01DottedLeftCellFormat.setFont(rowBoldFont);
		rowOrange01DottedLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		rowOrange01DottedLeftCellFormat.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_ORANGE01, rowOrange01DottedLeftCellFormat);
		// ROW_DOTTED_LEFT_ORANGE02
		XSSFCellStyle rowOrange02DottedLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange02DottedLeftCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange02DottedLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowOrange02DottedLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange02DottedLeftCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange02);
		rowOrange02DottedLeftCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange02DottedLeftCellFormat.setFont(rowBoldFont);
		rowOrange02DottedLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		rowOrange02DottedLeftCellFormat.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_ORANGE02, rowOrange02DottedLeftCellFormat);
		// ROW_DOTTED_LEFT_ORANGE03
		XSSFCellStyle rowOrange03DottedLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange03DottedLeftCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange03DottedLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowOrange03DottedLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange03DottedLeftCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange03);
		rowOrange03DottedLeftCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange03DottedLeftCellFormat.setFont(rowBoldFont);
		rowOrange03DottedLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		rowOrange03DottedLeftCellFormat.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_ORANGE03, rowOrange03DottedLeftCellFormat);
		// ROW_DOTTED_LEFT_ORANGE03_RED
		XSSFCellStyle rowOrange03DottedLeftCellFormatRed = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange03DottedLeftCellFormatRed, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange03DottedLeftCellFormatRed.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowOrange03DottedLeftCellFormatRed.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange03DottedLeftCellFormatRed.setFillForegroundColor(ExcelPOIUtils.poiOrange03);
		rowOrange03DottedLeftCellFormatRed.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange03DottedLeftCellFormatRed.setFont(rowBoldRedFont);
		rowOrange03DottedLeftCellFormatRed.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_ORANGE03_RED, rowOrange03DottedLeftCellFormatRed);
		// ROW_DOTTED_LEFT_ORANGE04
		XSSFCellStyle rowOrange04DottedLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange04DottedLeftCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange04DottedLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowOrange04DottedLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange04DottedLeftCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange04);
		rowOrange04DottedLeftCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange04DottedLeftCellFormat.setFont(rowBoldFont);
		rowOrange04DottedLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		rowOrange04DottedLeftCellFormat.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_ORANGE04, rowOrange04DottedLeftCellFormat);
		// ROW_DOTTED_LEFT_ORANGE05
		XSSFCellStyle rowOrange05DottedLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange05DottedLeftCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange05DottedLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowOrange05DottedLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange05DottedLeftCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange05);
		rowOrange05DottedLeftCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange05DottedLeftCellFormat.setFont(rowBoldFont);
		rowOrange05DottedLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		rowOrange04DottedLeftCellFormat.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_ORANGE05, rowOrange05DottedLeftCellFormat);
		// ROW_DOTTED_LEFT_ORANGE06
		XSSFCellStyle rowOrange06DottedLeftCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange06DottedLeftCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange06DottedLeftCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.LEFT);
		rowOrange06DottedLeftCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange06DottedLeftCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange06);
		rowOrange06DottedLeftCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange06DottedLeftCellFormat.setFont(rowBoldFont);
		rowOrange06DottedLeftCellFormat.setDataFormat(fmt.getFormat("@"));
		rowOrange04DottedLeftCellFormat.setWrapText(true);
		styles.put(ExcelPOIUtils.ROW_DOTTED_LEFT_ORANGE06, rowOrange06DottedLeftCellFormat);

		/* Begin Xu ly ROW_DOTTED_CENTER_ORANGE */
		// ROW_DOTTED_CENTER_ORANGE01 // vuongmq
		XSSFCellStyle rowOrange01DottedCenterCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange01DottedCenterCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange01DottedCenterCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowOrange01DottedCenterCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange01DottedCenterCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange01);
		rowOrange01DottedCenterCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange01DottedCenterCellFormat.setFont(rowBoldFont);
		rowOrange01DottedCenterCellFormat.setDataFormat(fmt.getFormat("@"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_ORANGE01, rowOrange01DottedCenterCellFormat);

		// ROW_DOTTED_CENTER_ORANGE02 // vuongmq
		XSSFCellStyle rowOrange02DottedCenterCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange02DottedCenterCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange02DottedCenterCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowOrange02DottedCenterCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange02DottedCenterCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange02);
		rowOrange02DottedCenterCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange02DottedCenterCellFormat.setFont(rowBoldFont);
		rowOrange02DottedCenterCellFormat.setDataFormat(fmt.getFormat("@"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_ORANGE02, rowOrange02DottedCenterCellFormat);

		// ROW_DOTTED_CENTER_ORANGE03 // vuongmq
		XSSFCellStyle rowOrange03DottedCenterCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange03DottedCenterCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange03DottedCenterCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowOrange03DottedCenterCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange03DottedCenterCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange03);
		rowOrange03DottedCenterCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange03DottedCenterCellFormat.setFont(rowBoldFont);
		rowOrange03DottedCenterCellFormat.setDataFormat(fmt.getFormat("@"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_ORANGE03, rowOrange03DottedCenterCellFormat);

		// ROW_DOTTED_CENTER_ORANGE04 // vuongmq
		XSSFCellStyle rowOrange04DottedCenterCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange04DottedCenterCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange04DottedCenterCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowOrange04DottedCenterCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange04DottedCenterCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange04);
		rowOrange04DottedCenterCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange04DottedCenterCellFormat.setFont(rowBoldFont);
		rowOrange04DottedCenterCellFormat.setDataFormat(fmt.getFormat("@"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_ORANGE04, rowOrange04DottedCenterCellFormat);

		// ROW_DOTTED_CENTER_ORANGE05 // vuongmq
		XSSFCellStyle rowOrange05DottedCenterCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange05DottedCenterCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange05DottedCenterCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowOrange05DottedCenterCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange05DottedCenterCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange05);
		rowOrange05DottedCenterCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange05DottedCenterCellFormat.setFont(rowBoldFont);
		rowOrange05DottedCenterCellFormat.setDataFormat(fmt.getFormat("@"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_ORANGE05, rowOrange05DottedCenterCellFormat);

		// ROW_DOTTED_CENTER_ORANGE06 // vuongmq
		XSSFCellStyle rowOrange06DottedCenterCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange06DottedCenterCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange06DottedCenterCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		rowOrange06DottedCenterCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange06DottedCenterCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange06);
		rowOrange06DottedCenterCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange06DottedCenterCellFormat.setFont(rowBoldFont);
		rowOrange06DottedCenterCellFormat.setDataFormat(fmt.getFormat("@"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_CENTER_ORANGE06, rowOrange06DottedCenterCellFormat);
		/* End Xu ly ROW_DOTTED_CENTER_ORANGE */

		// ROW_DOTTED_RIGHT_ORANGE01
		XSSFCellStyle rowOrange01DottedRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange01DottedRightCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange01DottedRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange01DottedRightCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange01DottedRightCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange01);
		rowOrange01DottedRightCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange01DottedRightCellFormat.setFont(rowBoldFont);
		rowOrange01DottedRightCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE01, rowOrange01DottedRightCellFormat);
		// ROW_DOTTED_RIGTH_ORANGE01_PERCENT
		XSSFCellStyle rowOrange01DottedRightCellFormatPercent = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange01DottedRightCellFormatPercent, BorderStyle.DOTTED,
				ExcelPOIUtils.poiBlack);
		rowOrange01DottedRightCellFormatPercent.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange01DottedRightCellFormatPercent
				.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange01DottedRightCellFormatPercent.setFillForegroundColor(ExcelPOIUtils.poiOrange01);
		rowOrange01DottedRightCellFormatPercent.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange01DottedRightCellFormatPercent.setFont(rowBoldFont);
		rowOrange01DottedRightCellFormatPercent.setDataFormat(fmt.getFormat("0.00\\%;-0.00\\%;0.00\\%"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE01_PERCENT, rowOrange01DottedRightCellFormatPercent);
		// ROW_DOTTED_RIGHT_ORANGE01_RED
		XSSFCellStyle rowOrange01DottedRightRedCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange01DottedRightRedCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange01DottedRightRedCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange01DottedRightRedCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange01DottedRightRedCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange01);
		rowOrange01DottedRightRedCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange01DottedRightRedCellFormat.setFont(rowBoldRedFont);
		rowOrange01DottedRightRedCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE01_RED, rowOrange01DottedRightRedCellFormat);
		// ROW_DOTTED_RIGHT_ORANGE02
		XSSFCellStyle rowOrange02DottedRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange02DottedRightCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange02DottedRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange02DottedRightCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange02DottedRightCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange02);
		rowOrange02DottedRightCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange02DottedRightCellFormat.setFont(rowBoldFont);
		rowOrange02DottedRightCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE02, rowOrange02DottedRightCellFormat);
		// ROW_DOTTED_RIGTH_ORANGE02_PERCENT
		XSSFCellStyle rowOrange02DottedRightCellFormatPercent = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange02DottedRightCellFormatPercent, BorderStyle.DOTTED,
				ExcelPOIUtils.poiBlack);
		rowOrange02DottedRightCellFormatPercent.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange02DottedRightCellFormatPercent
				.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange02DottedRightCellFormatPercent.setFillForegroundColor(ExcelPOIUtils.poiOrange02);
		rowOrange02DottedRightCellFormatPercent.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange02DottedRightCellFormatPercent.setFont(rowBoldFont);
		rowOrange02DottedRightCellFormatPercent.setDataFormat(fmt.getFormat("0.00\\%;-0.00\\%;0.00\\%"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE02_PERCENT, rowOrange02DottedRightCellFormatPercent);
		// ROW_DOTTED_RIGHT_ORANGE02_RED
		XSSFCellStyle rowOrange02DottedRightRedCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange02DottedRightRedCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange02DottedRightRedCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange02DottedRightRedCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange02DottedRightRedCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange02);
		rowOrange02DottedRightRedCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange02DottedRightRedCellFormat.setFont(rowBoldRedFont);
		rowOrange02DottedRightRedCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE02_RED, rowOrange02DottedRightRedCellFormat);
		// ROW_DOTTED_RIGHT_ORANGE03
		XSSFCellStyle rowOrange03DottedRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange03DottedRightCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange03DottedRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange03DottedRightCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange03DottedRightCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange03);
		rowOrange03DottedRightCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange03DottedRightCellFormat.setFont(rowBoldFont);
		rowOrange03DottedRightCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE03, rowOrange03DottedRightCellFormat);
		// ROW_DOTTED_RIGTH_ORANGE03_PERCENT
		XSSFCellStyle rowOrange03DottedRightCellFormatPercent = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange03DottedRightCellFormatPercent, BorderStyle.DOTTED,
				ExcelPOIUtils.poiBlack);
		rowOrange03DottedRightCellFormatPercent.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange03DottedRightCellFormatPercent
				.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange03DottedRightCellFormatPercent.setFillForegroundColor(ExcelPOIUtils.poiOrange03);
		rowOrange03DottedRightCellFormatPercent.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange03DottedRightCellFormatPercent.setFont(rowBoldFont);
		rowOrange03DottedRightCellFormatPercent.setDataFormat(fmt.getFormat("0.00\\%;-0.00\\%;0.00\\%"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE03_PERCENT, rowOrange03DottedRightCellFormatPercent);
		// ROW_DOTTED_RIGHT_ORANGE03_RED
		XSSFCellStyle rowOrange03DottedRightRedCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange03DottedRightRedCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange03DottedRightRedCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange03DottedRightRedCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange03DottedRightRedCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange03);
		rowOrange03DottedRightRedCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange03DottedRightRedCellFormat.setFont(rowBoldRedFont);
		rowOrange03DottedRightRedCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE03_RED, rowOrange03DottedRightRedCellFormat);
		// ROW_DOTTED_RIGHT_ORANGE04
		XSSFCellStyle rowOrange04DottedRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange04DottedRightCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange04DottedRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange04DottedRightCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange04DottedRightCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange04);
		rowOrange04DottedRightCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange04DottedRightCellFormat.setFont(rowBoldFont);
		rowOrange04DottedRightCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE04, rowOrange04DottedRightCellFormat);
		// ROW_DOTTED_RIGTH_ORANGE04_PERCENT
		XSSFCellStyle rowOrange04DottedRightCellFormatPercent = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange04DottedRightCellFormatPercent, BorderStyle.DOTTED,
				ExcelPOIUtils.poiBlack);
		rowOrange04DottedRightCellFormatPercent.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange04DottedRightCellFormatPercent
				.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange04DottedRightCellFormatPercent.setFillForegroundColor(ExcelPOIUtils.poiOrange04);
		rowOrange04DottedRightCellFormatPercent.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange04DottedRightCellFormatPercent.setFont(rowBoldFont);
		rowOrange04DottedRightCellFormatPercent.setDataFormat(fmt.getFormat("0.00\\%;-0.00\\%;0.00\\%"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE04_PERCENT, rowOrange04DottedRightCellFormatPercent);
		// ROW_DOTTED_RIGHT_ORANGE04
		XSSFCellStyle rowOrange04DottedRightRedCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange04DottedRightRedCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange04DottedRightRedCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange04DottedRightRedCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange04DottedRightRedCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange04);
		rowOrange04DottedRightRedCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange04DottedRightRedCellFormat.setFont(rowBoldRedFont);
		rowOrange04DottedRightRedCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE04_RED, rowOrange04DottedRightRedCellFormat);
		// ROW_DOTTED_RIGHT_ORANGE05
		XSSFCellStyle rowOrange05DottedRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange05DottedRightCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange05DottedRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange05DottedRightCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange05DottedRightCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange05);
		rowOrange05DottedRightCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange05DottedRightCellFormat.setFont(rowBoldFont);
		rowOrange05DottedRightCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE05, rowOrange05DottedRightCellFormat);
		// ROW_DOTTED_RIGTH_ORANGE05_PERCENT
		XSSFCellStyle rowOrange05DottedRightCellFormatPercent = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange05DottedRightCellFormatPercent, BorderStyle.DOTTED,
				ExcelPOIUtils.poiBlack);
		rowOrange05DottedRightCellFormatPercent.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange05DottedRightCellFormatPercent
				.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange05DottedRightCellFormatPercent.setFillForegroundColor(ExcelPOIUtils.poiOrange05);
		rowOrange05DottedRightCellFormatPercent.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange05DottedRightCellFormatPercent.setFont(rowBoldFont);
		rowOrange05DottedRightCellFormatPercent.setDataFormat(fmt.getFormat("0.00\\%;-0.00\\%;0.00\\%"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE05_PERCENT, rowOrange05DottedRightCellFormatPercent);
		// ROW_DOTTED_RIGHT_ORANGE05
		XSSFCellStyle rowOrange05DottedRightRedCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange05DottedRightRedCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange05DottedRightRedCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange05DottedRightRedCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange05DottedRightRedCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange05);
		rowOrange05DottedRightRedCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange05DottedRightRedCellFormat.setFont(rowBoldRedFont);
		rowOrange05DottedRightRedCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE05_RED, rowOrange05DottedRightRedCellFormat);
		// ROW_DOTTED_RIGHT_ORANGE06
		XSSFCellStyle rowOrange06DottedRightCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange06DottedRightCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange06DottedRightCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange06DottedRightCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange06DottedRightCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange06);
		rowOrange06DottedRightCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange06DottedRightCellFormat.setFont(rowBoldFont);
		rowOrange06DottedRightCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE06, rowOrange06DottedRightCellFormat);
		// ROW_DOTTED_RIGHT_ORANGE06
		XSSFCellStyle rowOrange06DottedRightRedCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(rowOrange06DottedRightRedCellFormat, BorderStyle.DOTTED, ExcelPOIUtils.poiBlack);
		rowOrange06DottedRightRedCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
		rowOrange06DottedRightRedCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		rowOrange06DottedRightRedCellFormat.setFillForegroundColor(ExcelPOIUtils.poiOrange06);
		rowOrange06DottedRightRedCellFormat.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		rowOrange06DottedRightRedCellFormat.setFont(rowBoldRedFont);
		rowOrange06DottedRightRedCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.ROW_DOTTED_RIGHT_ORANGE06_RED, rowOrange06DottedRightRedCellFormat);

		// NORMAL_BORDER
		XSSFCellStyle normalBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(normalBorderCellFormat, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		normalBorderCellFormat.setFont(normalFont);
		styles.put(ExcelPOIUtils.NORMAL_BORDER, normalBorderCellFormat);

		// NORMAL_CENTER_BORDER
		XSSFCellStyle normalCenterBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(normalCenterBorderCellFormat, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		normalCenterBorderCellFormat.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		normalCenterBorderCellFormat.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		normalCenterBorderCellFormat.setFont(normalFont);
		styles.put(ExcelPOIUtils.NORMAL_CENTER_BORDER, normalCenterBorderCellFormat);

		// NORMAL_NUMBER_BORDER
		XSSFCellStyle detailNumberBorderCellFormat = (XSSFCellStyle) wb.createCellStyle();
		ExcelPOIUtils.setBorderForCell(detailNumberBorderCellFormat, BorderStyle.THIN, ExcelPOIUtils.poiBlack);
		detailNumberBorderCellFormat.setFont(normalFont);
		detailNumberBorderCellFormat.setDataFormat(fmt.getFormat("#,##0"));
		styles.put(ExcelPOIUtils.NORMAL_NUMBER_BORDER, detailNumberBorderCellFormat);

		// tamvnm: 17/09/2015
		// HEADER_GREEN04_ALl_THIN_WRAPTEXT
		XSSFCellStyle headerGreen04Wraptext = (XSSFCellStyle) wb.createCellStyle();
		headerGreen04Wraptext.setFillForegroundColor(ExcelPOIUtils.poiGreen04);
		headerGreen04Wraptext.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerGreen04Wraptext.setWrapText(true);
		headerGreen04Wraptext.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerGreen04Wraptext.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerGreen04Wraptext, BorderStyle.THIN, ExcelPOIUtils.poiBlack, null,
				BorderStyle.THIN, null, BorderStyle.THIN);
		headerGreen04Wraptext.setFont(menuFont);
		styles.put(ExcelPOIUtils.HEADER_GREEN04_ALl_THIN_WRAPTEXT, headerGreen04Wraptext);

		// HEADER_GREEN_TOP_BOTTOM_MEDIUM_WRAP_TEXT
		XSSFCellStyle headerGreenTopBottomMediumWrapText = (XSSFCellStyle) wb.createCellStyle();
		headerGreenTopBottomMediumWrapText.setFillForegroundColor(ExcelPOIUtils.poiGreen02);
		headerGreenTopBottomMediumWrapText.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerGreenTopBottomMediumWrapText.setWrapText(true);
		headerGreenTopBottomMediumWrapText.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
		headerGreenTopBottomMediumWrapText.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
		ExcelPOIUtils.setBorderForCell(headerGreenTopBottomMediumWrapText, BorderStyle.MEDIUM, ExcelPOIUtils.poiBlack,
				null, BorderStyle.THIN, null, BorderStyle.THIN);
		headerGreenTopBottomMediumWrapText.setFont(menuFontSaleMT);
		styles.put(ExcelPOIUtils.HEADER_GREEN_TOP_BOTTOM_MEDIUM_WRAP_TEXT, headerGreenTopBottomMediumWrapText);

		// TEXT_ALIGN_LEFT
		XSSFCellStyle group1 = (XSSFCellStyle) wb.createCellStyle();
//		group1.setAlignment(HorizontalAlignment.LEFT);
		group1.setFillForegroundColor(new XSSFColor(new Color(197, 217, 241)));
		group1.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		group1.setDataFormat(fmt.getFormat("@"));
		group1.setFont(boldFont);
		ExcelPOIUtils.setBorderForCell(group1);
		styles.put(ExcelPOIUtils.STYLE_TEXT_GROUP_LEVEL_1, group1);

		XSSFCellStyle normalGroup1 = (XSSFCellStyle) wb.createCellStyle();
		normalGroup1.setAlignment(HorizontalAlignment.LEFT);
		normalGroup1.setFillForegroundColor(new XSSFColor(new Color(197, 217, 241)));
		normalGroup1.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		normalGroup1.setDataFormat(fmt.getFormat("@"));
		ExcelPOIUtils.setBorderForCell(normalGroup1);
		normalGroup1.setFont(font);
		styles.put(ExcelPOIUtils.STYLE_TEXT_NORMAL_GROUP_LEVEL_1, normalGroup1);

		XSSFCellStyle group2 = (XSSFCellStyle) wb.createCellStyle();
		group2.setAlignment(HorizontalAlignment.LEFT);
		group2.setFillForegroundColor(new XSSFColor(new Color(0, 176, 240)));
		group2.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		group2.setDataFormat(fmt.getFormat("@"));
		group2.setFont(boldFont);
		ExcelPOIUtils.setBorderForCell(group2);
		styles.put(ExcelPOIUtils.STYLE_TEXT_GROUP_LEVEL_2, group2);

		XSSFCellStyle normalGroup2 = (XSSFCellStyle) wb.createCellStyle();
		normalGroup2.setAlignment(HorizontalAlignment.LEFT);
		normalGroup2.setFillForegroundColor(new XSSFColor(new Color(0, 176, 240)));
		normalGroup2.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		normalGroup2.setDataFormat(fmt.getFormat("@"));
		normalGroup2.setFont(font);
		ExcelPOIUtils.setBorderForCell(normalGroup2);
		styles.put(ExcelPOIUtils.STYLE_TEXT_NORMAL_GROUP_LEVEL_2, normalGroup2);

		XSSFCellStyle group3 = (XSSFCellStyle) wb.createCellStyle();
		group3.setAlignment(HorizontalAlignment.LEFT);
		group3.setFillForegroundColor(new XSSFColor(new Color(83, 141, 213)));
		group3.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		group3.setDataFormat(fmt.getFormat("@"));
		group3.setFont(boldFont);
		ExcelPOIUtils.setBorderForCell(group3);
		styles.put(ExcelPOIUtils.STYLE_TEXT_GROUP_LEVEL_3, group3);

		XSSFCellStyle normalGroup3 = (XSSFCellStyle) wb.createCellStyle();
		normalGroup3.setAlignment(HorizontalAlignment.LEFT);
		normalGroup3.setFillForegroundColor(new XSSFColor(new Color(83, 141, 213)));
		normalGroup3.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		normalGroup3.setDataFormat(fmt.getFormat("@"));
		normalGroup3.setFont(font);
		ExcelPOIUtils.setBorderForCell(normalGroup3);
		styles.put(ExcelPOIUtils.STYLE_TEXT_NORMAL_GROUP_LEVEL_3, normalGroup3);

		XSSFCellStyle group4 = (XSSFCellStyle) wb.createCellStyle();
		group4.setAlignment(HorizontalAlignment.LEFT);
		group4.setFillForegroundColor(new XSSFColor(new Color(146, 205, 220)));
		group4.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		group4.setDataFormat(fmt.getFormat("@"));
		group4.setFont(boldFont);
		ExcelPOIUtils.setBorderForCell(group4);
		styles.put(ExcelPOIUtils.STYLE_TEXT_GROUP_LEVEL_4, group4);

		XSSFCellStyle normalGroup4 = (XSSFCellStyle) wb.createCellStyle();
		normalGroup4.setAlignment(HorizontalAlignment.LEFT);
		normalGroup4.setFillForegroundColor(new XSSFColor(new Color(146, 205, 220)));
		normalGroup4.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		normalGroup4.setDataFormat(fmt.getFormat("@"));
		normalGroup4.setFont(font);
		ExcelPOIUtils.setBorderForCell(normalGroup4);
		styles.put(ExcelPOIUtils.STYLE_TEXT_NORMAL_GROUP_LEVEL_4, normalGroup4);

		XSSFCellStyle group5 = (XSSFCellStyle) wb.createCellStyle();
		group5.setAlignment(HorizontalAlignment.LEFT);
		group5.setFillForegroundColor(new XSSFColor(new Color(221, 217, 196)));
		group5.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		group5.setDataFormat(fmt.getFormat("@"));
		group5.setFont(boldFont);
		ExcelPOIUtils.setBorderForCell(group5);
		styles.put(ExcelPOIUtils.STYLE_TEXT_GROUP_LEVEL_5, group5);

		XSSFCellStyle normalGroup5 = (XSSFCellStyle) wb.createCellStyle();
		normalGroup5.setAlignment(HorizontalAlignment.LEFT);
		normalGroup5.setFillForegroundColor(new XSSFColor(new Color(221, 217, 196)));
		normalGroup5.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		normalGroup5.setDataFormat(fmt.getFormat("@"));
		normalGroup5.setFont(font);
		ExcelPOIUtils.setBorderForCell(normalGroup5);
		styles.put(ExcelPOIUtils.STYLE_TEXT_NORMAL_GROUP_LEVEL_5, normalGroup5);

		/*
		 * XSSFCellStyle rowOrange02DottedRightCellFormatNoBod = (XSSFCellStyle)
		 * wb.createCellStyle(); rowOrange02DottedRightCellFormatNoBod.cloneStyleFrom
		 * (styles.get(ROW_DOTTED_LEFT_ORANGE03));
		 * rowOrange02DottedRightCellFormatNoBod.setFont(detailFont);
		 * styles.put(ROW_DOTTED_LEFT_ORANGE03_NOBOD,
		 * rowOrange02DottedRightCellFormatNoBod);
		 */

		return styles;
	}

	/**
	 * Set Border Style for a CellStyle
	 *
	 * @author hunglm16
	 * @since February 27, 2014
	 */
	public static CellStyle setBorderForCell(CellStyle cellStyle, BorderStyle borderStyle, XSSFColor borderColor,
			BorderStyle... params) {
		// STYLE CHO BODER
		BorderStyle border = borderStyle == null ? BorderStyle.NONE : borderStyle;
//		Short border = borderStyle == null ? -1 : Short.valueOf(String.valueOf(borderStyle.ordinal()));
		Short color = borderColor == null ? -1 : borderColor.getIndexed();
		if (border != BorderStyle.NONE) {
			cellStyle.setBorderLeft(border);
			cellStyle.setBorderTop(border);
			cellStyle.setBorderRight(border);
			cellStyle.setBorderBottom(border);
		}
		// Gan mau cho boder
		if (color != -1) {
			cellStyle.setTopBorderColor(color);
			cellStyle.setBottomBorderColor(color);
			cellStyle.setLeftBorderColor(color);
			cellStyle.setRightBorderColor(color);
		}
		// Lay thu tu boder can tuong tac (Tren-Trai-Duoi-Phai) (Nguoc kim dong ho)
		if (params.length <= 4) {
			int i = 0;
			for (BorderStyle sideBorder : params) {
				BorderStyle sBoder = sideBorder == null ? BorderStyle.NONE : sideBorder;
//				Short sBoder = sideBorder == null ? -1 : Short.valueOf(String.valueOf(sideBorder.ordinal()));
				switch (i++) {
				case (0):
					if (sBoder != BorderStyle.NONE) {
						cellStyle.setBorderTop(sBoder);
					}
					break;
				case (1):
					if (sBoder != BorderStyle.NONE) {
						cellStyle.setBorderLeft(sBoder);
					}
					break;
				case (2):
					if (sBoder != BorderStyle.NONE) {
						cellStyle.setBorderBottom(sBoder);
					}
					break;
				case (3):
					if (sBoder != BorderStyle.NONE) {
						cellStyle.setBorderRight(sBoder);
					}
					break;
				default:
					break;
				}
			}
		}
		return cellStyle;
	}

	/**
	 * @author hunglm16
	 * @since February 27, 2014
	 * @Description Dinh Nghia Font cho Cell
	 */
	public static XSSFFont setFontPOI(XSSFFont fontStyle, String fontName, Integer fontHeight, Boolean isBold,
			XSSFColor fontColor) {
		String fName = fontName == null ? "Arial" : fontName;
		Integer fHeight = fontHeight == null ? 9 : fontHeight;
		Boolean fIsBold = isBold == null ? false : isBold;
		XSSFColor fColor = fontColor == null ? new XSSFColor(new Color(0, 0, 0)) : fontColor;
		fontStyle.setBold(fIsBold);
		fontStyle.setFontName(fName);
		fontStyle.setFontHeight(fHeight);
		/*
		 * if (fColor.getRgb()[0] == 0 && fColor.getRgb()[1] == 0 && fColor.getRgb()[2]
		 * == 0) { fontStyle.setColor(HSSFColor.WHITE.index); } else if
		 * (fColor.getRgb()[0] == -1 && fColor.getRgb()[1] == -1 && fColor.getRgb()[2]
		 * == -1) { fontStyle.setColor(HSSFColor.BLACK.index); } else {
		 * fontStyle.setColor(fColor); }
		 */
		fontStyle.setColor(fColor);
		return fontStyle;
	}

	/**
	 * Merged theo toa do, add value
	 *
	 * @author hunglm16
	 * @since February 27,2014
	 * @description add Cells and Merged
	 *
	 */
	public static void addCellsAndMerged(SXSSFSheet sheet, int colIndex, int rowIndex, int endColIndex, int endRowIndex,
			Object value, XSSFCellStyle cellFormat) throws Exception {
		for (int i = rowIndex; i <= endRowIndex; i++) {
			Row row1 = sheet.getRow(i) == null ? sheet.createRow(i) : sheet.getRow(i);
			for (int j = colIndex; j <= endColIndex; j++) {
				Cell cell1 = row1.getCell(j) == null ? row1.createCell(j) : row1.getCell(j);
				cell1.setCellStyle(cellFormat);
				if ((i == rowIndex) && (j == colIndex)) {
					if (value != null) {
						ExcelPOIUtils.setCellValue(cell1, value);
					} else {
						cell1.setCellValue("");
					}
				}
			}
		}
		sheet.addMergedRegion(new CellRangeAddress(rowIndex, endRowIndex, colIndex, endColIndex));
	}

	public static void addCellsAndMerged(SXSSFSheet sheet, int colIndex, int rowIndex, int endColIndex, int endRowIndex,
			Object value, XSSFCellStyle cellFormat, ReportParameterVO rp) throws Exception {
		for (int i = rowIndex; i <= endRowIndex; i++) {
			Row row1 = sheet.getRow(i) == null ? sheet.createRow(i) : sheet.getRow(i);
			row1.setHeight(rp.getRowHeight());
			for (int j = colIndex; j <= endColIndex; j++) {
				Cell cell1 = row1.getCell(j) == null ? row1.createCell(j) : row1.getCell(j);
				cell1.setCellStyle(cellFormat);
				if ((i == rowIndex) && (j == colIndex)) {
					if (value != null) {
						ExcelPOIUtils.setCellValue(cell1, value);
					} else {
						cell1.setCellValue("");
					}
				}
			}
		}
		if ((rowIndex < endRowIndex) || (colIndex < endColIndex)) {
			sheet.addMergedRegion(new CellRangeAddress(rowIndex, endRowIndex, colIndex, endColIndex));
		}
	}

	public static void addCellsAndMerged(Sheet sheet, int colIndex, int rowIndex, int endColIndex, int endRowIndex,
			String value, CellStyle cellFormat) throws Exception {
		for (int i = rowIndex; i <= endRowIndex; i++) {
			Row row1 = sheet.getRow(i) == null ? sheet.createRow(i) : sheet.getRow(i);
			for (int j = colIndex; j <= endColIndex; j++) {
				Cell cell1 = row1.getCell(j) == null ? row1.createCell(j) : row1.getCell(j);
				cell1.setCellStyle(cellFormat);
				if ((i == rowIndex) && (j == colIndex)) {
					if (value != null) {
						cell1.setCellValue(value);
					} else {
						cell1.setCellValue("");
					}
				}
			}
		}
		sheet.addMergedRegion(new CellRangeAddress(rowIndex, endRowIndex, colIndex, endColIndex));
	}

	public static void addCellsAndMergedExtend(Sheet sheet, int maxRow, int colIndex, int rowIndex, int endColIndex,
			int endRowIndex, String value, CellStyle cellFormat) throws Exception {
		Row row;
		Cell cell;
		int more = 0;
		boolean isExist = false;
		for (int i = endRowIndex + 1; i <= maxRow; i++) {
			row = sheet.getRow(i);
			if (row == null) {
				break;
			}
			isExist = false;
			for (int j = colIndex; j <= endColIndex; j++) {
				cell = row.getCell(j);
				if (cell != null) {
					isExist = true;
					break;
				}

			}
			if (isExist) {
				break;

			}
			more++;
		}
		endRowIndex = endRowIndex + more;
		for (int i = rowIndex; i <= endRowIndex; i++) {
			Row row1 = sheet.getRow(i) == null ? sheet.createRow(i) : sheet.getRow(i);
			for (int j = colIndex; j <= endColIndex; j++) {
				Cell cell1 = row1.getCell(j) == null ? row1.createCell(j) : row1.getCell(j);
				cell1.setCellStyle(cellFormat);
				if ((i == rowIndex) && (j == colIndex)) {
					if (value != null) {
						cell1.setCellValue(value);
					} else {
						cell1.setCellValue("");
					}
				}
			}
		}
		sheet.addMergedRegion(new CellRangeAddress(rowIndex, endRowIndex, colIndex, endColIndex));
	}

	/**
	 * Merged theo toa do, add value
	 *
	 * @author hunglm16
	 * @since February 27,2014
	 * @description add Cells and Merged
	 *
	 */
	public static void addCellsAndMerged(SXSSFSheet sheet, int colIndex, int rowIndex, int endColIndex, int endRowIndex,
			String value) throws Exception {
		for (int i = rowIndex; i <= endRowIndex; i++) {
			Row row1 = sheet.getRow(i) == null ? sheet.createRow(i) : sheet.getRow(i);
			for (int j = colIndex; j <= endColIndex; j++) {
				Cell cell1 = row1.getCell(j) == null ? row1.createCell(j) : row1.getCell(j);
				if ((i == rowIndex) && (j == colIndex)) {
					if (value != null) {
						cell1.setCellValue(value);
					} else {
						cell1.setCellValue("");
					}
				}
			}
		}
		sheet.addMergedRegion(new CellRangeAddress(rowIndex, endRowIndex, colIndex, endColIndex));
	}

	private static Object toObject(String value, String fmt) {
		if (value == null) {
			return null;
		}

		if (value.endsWith("%")) {
			value = value.substring(0, value.length() - 1);
		}
		if (Utils.isNullOrEmpty(value)) {
			return null;
		}

		if (Utils.isNumberWithDecimal(value)) {
			if (!Utils.isNullOrEmpty(fmt) && fmt.contains("%")) {

				return Float.parseFloat(value);
			}

			return new BigDecimal(value);
		}

		return value;
	}

	public static void addMultiCells(SXSSFSheet sheet, int colIndex, int rowIndex, Object pMultiValues,
			XSSFCellStyle cellFormat, String wildcard, Integer numRows) throws Exception {

		int endRowInd = (rowIndex + numRows) - 1;
		if (!(pMultiValues instanceof String) || (pMultiValues == null)) {
			ExcelPOIUtils.addCellsAndMerged(sheet, colIndex, rowIndex, colIndex, endRowInd, pMultiValues, cellFormat);
			return;
		}

		String multiValues = (String) pMultiValues;
		if ((numRows == null) || (numRows == 0)) {
			System.out.println("numrows is null");
			return;
		}

		// kiem tra neu null hoac "" thi them cell luon

		String fmt = cellFormat.getDataFormatString();
		if (numRows == 1) {
			ExcelPOIUtils.addCell(sheet, colIndex, rowIndex, ExcelPOIUtils.toObject(multiValues, fmt), cellFormat);
			return;
		}

		String values[] = multiValues.split(wildcard);
		int len = values.length;

		if (len == 0) {
			ExcelPOIUtils.addCellsAndMerged(sheet, colIndex, rowIndex, colIndex, endRowInd, (Object) "", cellFormat);
			return;
		}

		// tu 0 -> len - 2: add row
		// tu len - 1 -> numRows: merge
		for (int i = 0; i < (len - 1); i++) {
			ExcelPOIUtils.addCell(sheet, colIndex, rowIndex, ExcelPOIUtils.toObject(values[i], fmt), cellFormat);
			rowIndex++;

		}
		if (len <= numRows) {

			ExcelPOIUtils.addCellsAndMerged(sheet, colIndex, rowIndex, colIndex, endRowInd,
					ExcelPOIUtils.toObject(values[len - 1], fmt), cellFormat);

		}

	}

	public static XSSFCellStyle createHyperLinkStyle(Workbook workbook, CellStyle cellStyle) {
		XSSFCellStyle wbStyle = (XSSFCellStyle) workbook.createCellStyle();

		wbStyle.cloneStyleFrom(cellStyle);
		wbStyle.setBorderLeft(cellStyle.getBorderLeftEnum());
		wbStyle.setBorderRight(cellStyle.getBorderRightEnum());
		wbStyle.setBorderTop(cellStyle.getBorderTopEnum());
		wbStyle.setBorderBottom(cellStyle.getBorderBottomEnum());
		XSSFFont fontHiberlink = wbStyle.getFont();
		fontHiberlink.setColor(new XSSFColor(Color.BLUE));
		fontHiberlink.setUnderline(FontUnderline.SINGLE);
		wbStyle.setFont(fontHiberlink);
		return wbStyle;
	}

	public static void addMultiCells(SXSSFSheet sheet, int colIndex, int rowIndex, Object pMultiValues,
			XSSFCellStyle cellFormat, String wildcard, Integer numRows, ReportParameterVO rp) throws Exception {

		int endRowInd = (rowIndex + numRows) - 1;
		if (!(pMultiValues instanceof String)) {
			ExcelPOIUtils.addCellsAndMerged(sheet, colIndex, rowIndex, colIndex, endRowInd, pMultiValues, cellFormat,
					rp);
			return;
		}

		String multiValues = (String) pMultiValues;
		if ((numRows == null) || (numRows == 0)) {
			System.out.println("numrows is null");
			return;
		}

		if (multiValues.startsWith("[BARCODE]")) {
			byte[] bytes = CodeGenerator.toBarcodeEAN13(multiValues.replaceAll("\\[BARCODE\\]", ""),
					sheet.getColumnWidth(colIndex), rp.getRowHeight());
			final int pictureIndex = sheet.getWorkbook().addPicture(bytes, Workbook.PICTURE_TYPE_PNG);

			final SXSSFDrawing drawing = sheet.createDrawingPatriarch();
			int padding = 5;
			XSSFClientAnchor anchor = new XSSFClientAnchor(0, padding * Units.EMU_PER_PIXEL, 0,
					-padding * Units.EMU_PER_PIXEL, colIndex, rowIndex, colIndex + 1, rowIndex + 1);
			anchor.setAnchorType(ClientAnchor.AnchorType.DONT_MOVE_AND_RESIZE);
			drawing.createPicture(anchor, pictureIndex);
			sheet.getRow(rowIndex).setHeight(rp.getRowHeight());
		}

		String fmt = cellFormat.getDataFormatString();

		String values[] = multiValues.split(wildcard);
		int len = values.length;

		if (len == 0) {
			ExcelPOIUtils.addCellsAndMerged(sheet, colIndex, rowIndex, colIndex, endRowInd, "", cellFormat, rp);
			return;
		}

		// check hyperlink thi phan tu thu 2 phai bat dau bang [URL]
		if ((len > 1) && (values[1] != null) && values[1].startsWith("[URL]")) {
			String urlPath = (String) rp.getExtraParam("URL_PATH");

			String contextPathStr = urlPath + values[1].substring(5);
			Workbook wb = sheet.getWorkbook();
			XSSFHyperlink hyperlink = (XSSFHyperlink) wb.getCreationHelper()
					.createHyperlink(org.apache.poi.common.usermodel.HyperlinkType.URL);
			hyperlink.setAddress(contextPathStr);

			XSSFCellStyle format = ExcelPOIUtils.createHyperLinkStyle(wb, cellFormat);

			Cell cell = ExcelPOIUtils.addCell(sheet, colIndex, rowIndex, ExcelPOIUtils.toObject(values[0], fmt),
					format);
			cell.setHyperlink(hyperlink);

			return;
		}

		// tu 0 -> len - 2: add row
		// tu len - 1 -> numRows: merge
		for (int i = 0; i < (len - 1); i++) {
			ExcelPOIUtils.addCell(sheet, colIndex, rowIndex, ExcelPOIUtils.toObject(values[i], fmt), cellFormat);
			rowIndex++;

		}
		if (len <= numRows) {

			ExcelPOIUtils.addCellsAndMerged(sheet, colIndex, rowIndex, colIndex, endRowInd,
					ExcelPOIUtils.toObject(values[len - 1], fmt), cellFormat, rp);

		}

	}

	/**
	 * Add cell
	 *
	 * @author hunglm16
	 * @since February 27, 2014
	 * @description Add cell
	 */
	public static void addCell(SXSSFSheet sheet, int colIndex, int rowIndex, Integer value, XSSFCellStyle cellFormat)
			throws Exception {
		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
		Cell cell = row.getCell(colIndex) == null ? row.createCell(colIndex) : row.getCell(colIndex);
		if (value != null) {
			cell.setCellValue(value.doubleValue());
		} else {
			cell.setCellValue(0);
		}
		cell.setCellStyle(cellFormat);
	}

	public static void addCell(SXSSFSheet sheet, int colIndex, int rowIndex, String value, XSSFCellStyle cellFormat)
			throws Exception {

		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
		Cell cell = row.getCell(colIndex) == null ? row.createCell(colIndex) : row.getCell(colIndex);

		if (!Utils.isNullOrEmpty(value)) {

			cell.setCellValue(value);

		} else {

			cell.setCellValue("");

		}
		if (cellFormat != null) {
			cell.setCellStyle(cellFormat);
		}

	}

	public static void addCell(SXSSFSheet sheet, int colIndex, int rowIndex, BigDecimal value, XSSFCellStyle cellFormat)
			throws Exception {
		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
		Cell cell = row.getCell(colIndex) == null ? row.createCell(colIndex) : row.getCell(colIndex);
		if (value != null) {
			cell.setCellValue(value.doubleValue());
		} else {
			cell.setCellValue(0);
		}
		cell.setCellStyle(cellFormat);
	}

	public static void addCell(SXSSFSheet sheet, int colIndex, int rowIndex, BigDecimal value, String defaultValue,
			XSSFCellStyle cellFormat) throws Exception {
		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
		Cell cell = row.getCell(colIndex) == null ? row.createCell(colIndex) : row.getCell(colIndex);
		if (value != null) {
			cell.setCellValue(value.doubleValue());
		} else {
			cell.setCellValue(defaultValue);
		}
		cell.setCellStyle(cellFormat);
	}

	public static void addCell(SXSSFSheet sheet, int colIndex, int rowIndex, Double value, XSSFCellStyle cellFormat)
			throws Exception {
		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
		Cell cell = row.getCell(colIndex) == null ? row.createCell(colIndex) : row.getCell(colIndex);
		if (value != null) {
			cell.setCellValue(value.doubleValue());
		} else {
			cell.setCellValue(0);
		}
		cell.setCellStyle(cellFormat);
	}

	private static void setCellValue(Cell cell, Object value) throws Exception {
		if (value != null) {
			if (value instanceof BigDecimal) {

				cell.setCellValue(((BigDecimal) value).doubleValue());
			} else if (value instanceof Integer) {

				cell.setCellValue(((Integer) value).doubleValue());
			} else if (value instanceof Long) {

				cell.setCellValue(((Long) value).doubleValue());
			} else if (value instanceof Float) {

				cell.setCellValue(((Float) value).doubleValue());
			} else if (value instanceof Double) {
				cell.setCellValue(((Double) value).doubleValue());
			} else if (value instanceof String) {

				cell.setCellValue((String) value);
			}
		} else {
			cell.setCellValue("");
		}
	}

	public static Cell addCell(SXSSFSheet sheet, int colIndex, int rowIndex, Object value, XSSFCellStyle cellFormat)
			throws Exception {

		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
		Cell cell = row.getCell(colIndex) == null ? row.createCell(colIndex) : row.getCell(colIndex);

		ExcelPOIUtils.setCellValue(cell, value);
		cell.setCellStyle(cellFormat);
		return cell;
	}

	public static Cell addCell(Sheet sheet, int colIndex, int rowIndex, Object value, XSSFCellStyle cellFormat,
			Integer colWidth) throws Exception {
		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);

		Cell cell = row.getCell(colIndex);
		if (cell == null) {
			cell = row.createCell(colIndex);

		}
		if (colWidth != null) {
			sheet.setColumnWidth(colIndex, colWidth);
		}

		if (value != null) {
			if (value instanceof BigDecimal) {

				cell.setCellValue(((BigDecimal) value).doubleValue());
			} else if (value instanceof Integer) {

				cell.setCellValue(((Integer) value).doubleValue());
			} else if (value instanceof Long) {

				cell.setCellValue(((Long) value).doubleValue());
			} else if (value instanceof Float) {

				cell.setCellValue(((Float) value).doubleValue());
			} else if (value instanceof String) {

				cell.setCellValue((String) value);
			}
		} else {
			cell.setCellValue("");
		}

		cell.setCellStyle(cellFormat);
		return cell;
	}

	public static Cell addCell(Sheet sheet, int colIndex, int rowIndex, Object value, XSSFCellStyle cellFormat)
			throws Exception {

		return ExcelPOIUtils.addCell(sheet, colIndex, rowIndex, value, cellFormat, null);
	}

	public static void addFormulaCell(SXSSFSheet sheet, int colIndex, int rowIndex, String formula,
			XSSFCellStyle cellFormat) throws Exception {
		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
		Cell cell = row.getCell(colIndex) == null ? row.createCell(colIndex) : row.getCell(colIndex);
		cell.setCellFormula(formula);
		cell.setCellStyle(cellFormat);
	}

	/**
	 * Set RowHeight by height for row in index position (by point)
	 *
	 * @author hunglm16
	 * @since February 27, 2014
	 * @description Dat do cao height cho dong index (by point)
	 */
	public static void setRowHeight(SXSSFSheet sheet, int rowIndex, int height) {
		Row row = sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
		row.setHeight((short) (height * 20)); // 1/20 of a point
	}

	/**
	 * Set ColumnWidth by width for column in index position (by pixel)
	 *
	 * @author hunglm16
	 * @since February 27, 2014
	 * @description Dat do rong width cho cot index (by pixel)
	 */
	// public static void setColumnWidth(SXSSFSheet sheet, int colIndex, int width)
	// {
	// sheet.setColumnWidth(colIndex, (int) ((double) (width * 256) / (double)
	// (ConstantManager.XSSF_MAX_DIGIT_WIDTH +
	// ConstantManager.XSSF_CHARACTER_DEFAULT_PADDING)));
	// }

	/**
	 * Set ColumnWidthfor multiple Column, start from startIndex (by pixel)
	 *
	 * @author hunglm16
	 * @since February 27, 2014
	 * @description Dat do rong cho nhieu cot, bat dau tu cot thu startIndex (by
	 *              pixel)
	 */
	// public static void setColumnsWidth(SXSSFSheet sheet, Integer startIndex,
	// Integer... widths) {
	// for (int i = 0, sizeTmp = widths.length; i < sizeTmp; i++) {
	// sheet.setColumnWidth(i + startIndex, (int) ((double) (widths[i] * 256) /
	// (double) (ConstantManager.XSSF_MAX_DIGIT_WIDTH +
	// ConstantManager.XSSF_CHARACTER_DEFAULT_PADDING)));
	// }
	// }

	/**
	 * Set RowHeight for multiple row, start from startIndex (by point)
	 *
	 * @author hunglm16
	 * @since February 27, 2014
	 * @description Dat do cao cho nhieu dong, bat dau tu cot thu startIndex (by
	 *              point)
	 */
	public static void setRowsHeight(SXSSFSheet sheet, Integer startIndex, Integer... heights) {
		for (int i = 0, sizeTmp = heights.length; i < sizeTmp; i++) {
			ExcelPOIUtils.setRowHeight(sheet, i + startIndex, heights[i]);
		}
	}

	/**
	 * Set RowHeight for multiple row, start from startIndex (by point)
	 *
	 * @author hunglm16
	 * @since February 27, 2014
	 * @description flushAllRow And GroupLines
	 */
	public static void flushAllRowAndGroupLines(SXSSFSheet sheet, List<Integer> lstStartIndex,
			List<Integer> lstEndIndex, int curEndIndex, int rowNumInWindow) throws IOException {
		int curIndex = (curEndIndex - rowNumInWindow) + 1;
		List<Integer> lstCurStartIndex = new ArrayList<>();
		List<Integer> lstCurEndIndex = new ArrayList<>();
		lstCurStartIndex.addAll(lstStartIndex);
		lstCurEndIndex.addAll(lstEndIndex);

		if (((lstStartIndex != null) && (lstStartIndex.size() > 0))
				&& ((lstEndIndex != null) && (lstEndIndex.size() > 0))) {
			for (; curIndex <= curEndIndex; curIndex++) {
				for (int i = 0, sizeStart = lstStartIndex.size(); i < sizeStart; i++) {
					if ((curIndex >= lstCurStartIndex.get(i)) && (curIndex < lstCurEndIndex.get(i))) {
						sheet.groupRow(curIndex, curIndex);
					}
				}
			}
			sheet.flushRows();
			return;
		} else {
			sheet.flushRows();
			return;
		}
	}

	/**
	 * Set RowHeight for multiple row, start from startIndex (by point)
	 *
	 * @author hunglm16
	 * @since February 27, 2014
	 * @description groupRows(Ount Line)
	 */
	public static void groupRows(SXSSFSheet sheet, int startIndex, int endIndex, Integer rowNumInWindow,
			List<Integer> lstStartIndex, List<Integer> lstEndIndex) throws IOException {
		if (((lstStartIndex != null) && (lstStartIndex.size() > 0))
				&& ((lstEndIndex != null) && (lstEndIndex.size() > 0))) {
			if (((rowNumInWindow != null) && (rowNumInWindow >= 0))) {
				if ((endIndex - rowNumInWindow) > startIndex) {
					return;
				}
			}
			for (int i = 0; i < lstStartIndex.size(); i++) {
				if ((startIndex == lstStartIndex.get(i)) && (endIndex == lstEndIndex.get(i))) {
					lstStartIndex.remove(i);
					lstEndIndex.remove(i);
				}
			}
			sheet.groupRow(startIndex, endIndex);
		} else {
			sheet.groupRow(startIndex, endIndex);
		}
		return;
	}

	/**
	 * ghi du lieu vao cell
	 *
	 * @author tuannd20
	 * @param sheet       Sheet can ghi du lieu
	 * @param rowIndex    Dong cua cell
	 * @param columnIndex Cot cua cell
	 * @param cellData    Du lieu can ghi
	 * @since 28/03/2015
	 */
	public static void writeCellData(Sheet sheet, int rowIndex, int columnIndex, Object cellData) {
		if (sheet != null) {
			Row row = sheet.getRow(rowIndex) != null ? sheet.getRow(rowIndex) : sheet.createRow(rowIndex);
			Cell cell = row.getCell(columnIndex) != null ? row.getCell(columnIndex) : row.createCell(columnIndex);
			cell.setCellValue(cellData != null ? cellData.toString() : "");
		}
	}

	public static void writeCellData(Sheet sheet, int rowIndex, int columnIndex, Object cellData, XSSFCellStyle style) {
		if (sheet != null) {
			Row row = sheet.getRow(rowIndex) != null ? sheet.getRow(rowIndex) : sheet.createRow(rowIndex);
			Cell cell = row.getCell(columnIndex) != null ? row.getCell(columnIndex) : row.createCell(columnIndex);
			if (cellData != null) {
				if (cellData instanceof BigDecimal) {
					cell.setCellValue(((BigDecimal) cellData).doubleValue());
				} else if (cellData instanceof Integer) {
					cell.setCellValue(((Integer) cellData).doubleValue());
				} else if (cellData instanceof Long) {
					cell.setCellValue(((Long) cellData).doubleValue());
				} else if (cellData instanceof Float) {
					cell.setCellValue(((Float) cellData).doubleValue());
				} else if (cellData instanceof Double) {
					cell.setCellValue(((Double) cellData).doubleValue());
				} else if (cellData instanceof String) {
					cell.setCellValue((String) cellData);
				}
			} else {
				cell.setCellValue("");
			}
			// cell.setCellValue(cellData != null ? cellData.toString() : "");
			cell.setCellStyle(style);
		}
	}

	public static void setBorderForCell(XSSFCellStyle style) {
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);
	}

	/**
	 * ghi comment vao cell
	 *
	 * @author trietptm
	 * @param factory     CreationHelper workbook.getCreationHelper()
	 * @param sheet       Sheet can ghi du lieu
	 * @param rowIndex    Dong cua cell
	 * @param columnIndex Cot cua cell
	 * @param comment     ghi chu
	 * @param commentFont font ghi chu
	 * @since 28/03/2015
	 */
	public static void writeCellComment(CreationHelper factory, Sheet sheet, int rowIndex, int columnIndex,
			String comment, XSSFFont commentFont) {
		if (sheet != null) {
			Row row = sheet.getRow(rowIndex) != null ? sheet.getRow(rowIndex) : sheet.createRow(rowIndex);
			Cell cell = row.getCell(columnIndex) != null ? row.getCell(columnIndex) : row.createCell(columnIndex);
			Comment cmt = cell.getCellComment();
			if (cmt != null) {
				RichTextString str = factory.createRichTextString(comment);
				str.applyFont(commentFont);
				cmt.setString(str);
			}
		}
	}

	////////////////////////////////////////////////////////////

}
