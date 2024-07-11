package com.example.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class MainController {

    @Autowired
    private RecordRepository recordRepository;

    @GetMapping("/")
    public String index(Model model) {
        List<Record> records = recordRepository.findAll();
        model.addAttribute("records", records);
        model.addAttribute("record", new Record());
        return "index";
    }

    @PostMapping("/addRecord")
    public String addRecordSubmit(@ModelAttribute Record record) {
        recordRepository.save(record);
        return "redirect:/";
    }
}
