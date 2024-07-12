package com.example.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class MainController {

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private AddressRepository addressRepository;

    @GetMapping("/")
    public String index(Model model) {
        List<Record> records = recordRepository.findAll();
        List<Address> addresses = addressRepository.findAll();
        model.addAttribute("records", records);
        model.addAttribute("addresses", addresses);
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

    @PostMapping("/addAddress")
    public String addAddress(@RequestParam String address) {
        if (!addressRepository.findByAddress(address).isPresent()) {
            Address newAddress = new Address();
            newAddress.setAddress(address);
            addressRepository.save(newAddress);
        }
        return "redirect:/";
    }

    @GetMapping("/addresses")
    @ResponseBody
    public List<String> getAddresses(@RequestParam String term) {
        return addressRepository.findAll()
                .stream()
                .map(Address::getAddress)
                .filter(address -> address.toLowerCase().contains(term.toLowerCase()))
                .collect(Collectors.toList());
    }
}
