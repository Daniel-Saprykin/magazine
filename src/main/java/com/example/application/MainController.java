package com.example.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class MainController {

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ExecutorRepository executorRepository;

    @GetMapping("/")
    public String index(Model model) {
        List<Record> records = recordRepository.findAll(Sort.by(Sort.Direction.DESC, "applicationNumber"));
        List<Address> addresses = addressRepository.findAll();
        List<Executor> executors = executorRepository.findAll();
        model.addAttribute("records", records);
        model.addAttribute("addresses", addresses);
        model.addAttribute("executors", executors);
        model.addAttribute("record", new Record());
        return "index";
    }

    @PostMapping("/addRecord")
    public String addRecordSubmit(@ModelAttribute Record record) {
        long applicationNumber = recordRepository.count() + 1;
        record.setApplicationNumber(applicationNumber);
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
        Optional<Record> existingRecordOpt = recordRepository.findById(id);
        if (existingRecordOpt.isPresent()) {
            Record existingRecord = existingRecordOpt.get();
            record.setApplicationNumber(existingRecord.getApplicationNumber());
            recordRepository.save(record);
        }
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

    @PostMapping("/addExecutor")
    public String addExecutor(@RequestParam String name) {
        if (!executorRepository.findByName(name).isPresent()) {
            Executor newExecutor = new Executor();
            newExecutor.setName(name);
            executorRepository.save(newExecutor);
        }
        return "redirect:/";
    }

    @GetMapping("/executors")
    @ResponseBody
    public List<String> getExecutors(@RequestParam String term) {
        return executorRepository.findAll()
                .stream()
                .map(Executor::getName)
                .filter(name -> name.toLowerCase().contains(term.toLowerCase()))
                .collect(Collectors.toList());
    }
}
