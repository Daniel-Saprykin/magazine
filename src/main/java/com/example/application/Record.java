package com.example.application;

import java.text.SimpleDateFormat;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Setter;
import lombok.Getter;
import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
//
@Getter
@Setter
@Entity
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date date;
    private int shift;
    private String time;
    private String executor;
    private String address;
    private boolean important;
    private String description;
    private String result;
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "completion_date", nullable = true)
    private Date completionDate;
    @Column(name = "application_number", nullable = false)
    private Long applicationNumber;

//    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

//    public Date getParsedDate() throws ParseException {
//        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd"); // используйте нужный формат
//        return format.parse(this.date);
//    }
}
