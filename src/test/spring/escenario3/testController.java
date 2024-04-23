package test.spring.escenario3;

import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping
public class testController {

    @Autowired
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
