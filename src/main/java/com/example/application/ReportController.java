package com.example.application;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.util.stream.Stream;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@Controller
public class ReportController {

    @Autowired
    private RecordRepository recordRepository;

    @RequestMapping(value = "/generateReport", method = RequestMethod.GET)
    public void generateReport(HttpServletResponse response, Date startDate, Date endDate, String executor, String address) throws IOException, DocumentException {
        List<Record> records = recordRepository.findAll().stream()
                .filter(record -> {
                        Date recordDate = record.getDate();
                        boolean isDateInRange = !recordDate.before(startDate) && !recordDate.after(endDate);
                        boolean isExecutorMatch = executor == null || executor.isEmpty() || executor.equals(record.getExecutor());
                        boolean isAddressMatch = address == null || address.isEmpty() || address.equals(record.getAddress());
                        return isDateInRange && isExecutorMatch && isAddressMatch;

                })
                .collect(Collectors.toList());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, out);
        document.open();

        // Шрифты и стили
        BaseFont bf = BaseFont.createFont("fonts/NotoSans-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Font titleFont = new Font(bf, 18, Font.BOLD);
        Font subTitleFont = new Font(bf, 12, Font.BOLD);
        Font headerFont = new Font(bf, 10, Font.BOLD);
        Font cellFont = new Font(bf, 10, Font.NORMAL);

        // Заголовки и информация
        document.add(new Paragraph("Журнал", titleFont));
        document.add(new Paragraph("Отчет за период: " + startDate + " - " + endDate, subTitleFont));
        document.add(Chunk.NEWLINE);

        // Таблица
        PdfPTable table = new PdfPTable(8);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        float[] columnWidths = {1f, 1f, 1f, 1f, 2f, 2f, 2f, 2f};
        table.setWidths(columnWidths);

        addTableHeader(table, headerFont);
        addRows(table, records, cellFont);

        document.add(table);
        document.close();

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=report.pdf");
        response.getOutputStream().write(out.toByteArray());
    }

    private void addTableHeader(PdfPTable table, Font headerFont) {
        Stream.of("№", "Дата", "Смена", "Время", "Исполнитель", "Адрес", "Дата исполнения", "Результат")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setBorderWidth(2);
                    header.setPhrase(new Phrase(columnTitle, headerFont));
                    table.addCell(header);
                });
    }

    private void addRows(PdfPTable table, List<Record> records, Font cellFont) {
        for (Record record : records) {
            table.addCell(new PdfPCell(new Phrase(String.valueOf(record.getId()), cellFont)));
            table.addCell(new PdfPCell(new Phrase(String.valueOf(record.getDate()), cellFont)));
            table.addCell(new PdfPCell(new Phrase(String.valueOf(record.getShift()), cellFont)));
            table.addCell(new PdfPCell(new Phrase(record.getTime(), cellFont)));
            table.addCell(new PdfPCell(new Phrase(record.getExecutor(), cellFont)));
            table.addCell(new PdfPCell(new Phrase(record.getAddress(), cellFont)));
            table.addCell(new PdfPCell(new Phrase(String.valueOf(record.getCompletionDate()), cellFont)));
            table.addCell(new PdfPCell(new Phrase(record.getResult(), cellFont)));
        }
    }


}
