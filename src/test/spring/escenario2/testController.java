package test.spring.escenario2;

import java.util.Arrays;
import java.util.List;

public class testController {

    private String name;

    @GetMapping
    public testDetailDTO test() {
        return new testDetailDTO();
    }

    @GetMapping
    public List<Character> test2() {
        return Arrays.asList('a', 'b');
    }    
}
