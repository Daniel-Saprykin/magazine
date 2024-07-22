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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ReportController {

    @Autowired
    private RecordRepository recordRepository;

    public void generateReport(HttpServletResponse response, Date startDate, Date endDate, String executor) throws IOException, DocumentException {
        List<Record> records = recordRepository.findAll().stream()
                .filter(record -> {
                    try {
                        Date recordDate = record.getParsedDate();
                        return !recordDate.before(startDate) && !recordDate.after(endDate);
                    } catch (ParseException e) {
                        e.printStackTrace();
                        return false;
                    }
                })
                .filter(record -> executor == null || executor.isEmpty() || executor.equals(record.getExecutor()))
                .collect(Collectors.toList());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, out);
        document.open();

        document.add(new Paragraph("Отчет"));
        document.add(new Paragraph("Период: " + new SimpleDateFormat("dd.MM.yyyy").format(startDate) + " - " + new SimpleDateFormat("dd.MM.yyyy").format(endDate)));
        document.add(new Paragraph("Исполнитель: " + (executor.isEmpty() ? "Все" : executor)));
        document.add(new Paragraph(" "));

        for (Record record : records) {
            document.add(new Paragraph("Номер заявки: " + record.getApplicationNumber()));
            document.add(new Paragraph("Дата: " + record.getDate()));
            document.add(new Paragraph("Смена: " + record.getShift()));
            document.add(new Paragraph("Время: " + record.getTime()));
            document.add(new Paragraph("Исполнитель: " + record.getExecutor()));
            document.add(new Paragraph("Адрес: " + record.getAddress()));
            document.add(new Paragraph("Описание заявки: " + record.getDescription()));
            document.add(new Paragraph("Результат: " + record.getResult()));
            document.add(new Paragraph("Дата исполнения: " + record.getCompletionDate()));
            document.add(new Paragraph(" "));
        }

        document.close();

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=report.pdf");
        response.getOutputStream().write(out.toByteArray());
    }
}
