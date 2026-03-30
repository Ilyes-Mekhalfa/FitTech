import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
class Singup extends StatefulWidget {
  const Singup({super.key});

  @override
  State<Singup> createState() => _SingupState();
}

class _SingupState extends State<Singup> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('SIGNUP PAGE'),
            ElevatedButton(onPressed:(){
              context.pop(context);
            }, child: const Text('Go Back')),
          ],
        ),
      ),
    );
  }
}