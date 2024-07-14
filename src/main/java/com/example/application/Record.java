package com.example.application;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Setter;
import lombok.Getter;
//
@Getter
@Setter
@Entity
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String date;
    private int shift;
    private String time;
    private String executor;
    private String address;
    private boolean important;
    private String description;
    private String result;
    private String completionDate;
    private Long applicationNumber;
}
