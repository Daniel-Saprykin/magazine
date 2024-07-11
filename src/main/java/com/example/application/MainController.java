package com.example.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/record/{id}")
    @ResponseBody
    public ResponseEntity<Record> getRecord(@PathVariable Long id) {
        Optional<Record> record = recordRepository.findById(id);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/updateRecord/{id}")
    public String updateRecord(@PathVariable Long id, @ModelAttribute Record record) {
        record.setId(id);
        recordRepository.save(record);
        return "redirect:/";
    }
}
