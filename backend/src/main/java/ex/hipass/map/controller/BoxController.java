package ex.hipass.map.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/boxes")
public class BoxController {

    @GetMapping
    public List<Map<String, Object>> getBoxes() {
        List<Map<String, Object>> boxes = new ArrayList<>();

        boxes.add(Map.of("id", 1, "label", "T_STL_A", "position", List.of(-2, 0, 0)));
        boxes.add(Map.of("id", 2, "label", "T_STL_B", "position", List.of(0, 0, 0)));
        boxes.add(Map.of("id", 3, "label", "T_STL_C", "position", List.of(2, 0, 0)));

        return boxes;
    }
}