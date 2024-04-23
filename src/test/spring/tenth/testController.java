package test.spring.tenth;

@Controller
@RequestMapping
public class testController {

    @Autowired
    private String name;

    @GetMapping
    public String test() {
        return "test";
    }
    
}
